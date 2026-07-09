from flask import Flask, request, jsonify, session
from flask_cors import CORS
from db import Waste2WealthDB
import os

app = Flask(__name__)
# Enable CORS for frontend integration
CORS(app, supports_credentials=True)

# Secret key for session cookie encryption (use env in production)
app.secret_key = os.urandom(24)

# Initialize database class (values customizable with environment variables)
db_host = os.environ.get('DB_HOST', 'localhost')
db_user = os.environ.get('DB_USER', 'root')
db_password = os.environ.get('DB_PASSWORD', '')
db_name = os.environ.get('DB_NAME', 'waste2wealth')

db = Waste2WealthDB(host=db_host, user=db_user, password=db_password, database=db_name)

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "Waste2Wealth Flask API"})

@app.route('/api/register', methods=['POST'])
def register():
    """User and Recycler sign up route"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No registration details supplied"}), 400

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')
    role = data.get('role', 'user') # 'user' or 'recycler'
    company_name = data.get('company_name') # Optional

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required fields"}), 400

    success = db.register_user(
        name=name,
        email=email,
        password=password,
        phone=phone,
        role=role,
        company_name=company_name
    )

    if success:
        return jsonify({"success": True, "message": "Account registered successfully"}), 201
    else:
        return jsonify({"error": "Email is already registered or database connection failed"}), 400

@app.route('/api/login', methods=['POST'])
def login():
    """Authenticates the credentials and initializes the session cookie"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No login credentials supplied"}), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = db.authenticate_user(email, password)
    if user:
        # Populate session store
        session['user_id'] = user['id']
        session['user_name'] = user['name']
        session['user_role'] = user['role']
        return jsonify({"success": True, "user": user}), 200
    else:
        return jsonify({"error": "Invalid email or password combination"}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    """Destroys current authenticated session"""
    session.clear()
    return jsonify({"success": True, "message": "Successfully logged out"}), 200

@app.route('/api/me', methods=['GET'])
def current_user():
    """Gets current authenticated session details and latest statistics"""
    if 'user_id' not in session:
        return jsonify({"error": "Login required"}), 401

    stats = db.get_user_stats(session['user_id'])
    if stats:
        return jsonify({"user": stats}), 200
    return jsonify({"error": "Account not found or session corrupt"}), 404

@app.route('/api/requests', methods=['GET'])
def get_pickup_requests():
    """Retrieves list of request entries depending on logged-in role"""
    if 'user_id' not in session:
        return jsonify({"error": "Login required"}), 401

    user_id = session['user_id']
    role = session['user_role']

    requests_list = db.get_requests(user_id=user_id, role=role)
    return jsonify(requests_list), 200

@app.route('/api/requests/create', methods=['POST'])
def create_pickup():
    """Submits a new waste collection schedule request"""
    if 'user_id' not in session:
        return jsonify({"error": "Login required"}), 401

    if session['user_role'] != 'user':
        return jsonify({"error": "Only standard users can schedule pickup requests"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "No request parameters provided"}), 400

    waste_type = data.get('wasteType') # Plastic, Paper, Glass, etc.
    quantity = data.get('quantity')
    pickup_address = data.get('pickupAddress')
    contact_number = data.get('contactNumber', '')
    preferred_pickup_date = data.get('preferredPickupDate')

    if not waste_type or not quantity or not pickup_address or not preferred_pickup_date:
        return jsonify({"error": "Missing essential parameters (wasteType, quantity, pickupAddress, preferredPickupDate)"}), 400

    success = db.create_pickup_request(
        user_id=session['user_id'],
        waste_type=waste_type,
        quantity=float(quantity),
        pickup_address=pickup_address,
        contact_number=contact_number,
        preferred_pickup_date=preferred_pickup_date
    )

    if success:
        return jsonify({"success": True, "message": "Pickup scheduled successfully"}), 201
    return jsonify({"error": "Failed to schedule request. Database connection error"}), 500

@app.route('/api/requests/<int:request_id>/status', methods=['PUT'])
def update_request(request_id):
    """Recycling logistics operator updates request status"""
    if 'user_id' not in session:
        return jsonify({"error": "Login required"}), 401

    if session['user_role'] != 'recycler':
        return jsonify({"error": "Access forbidden: Only recyclers are authorized to modify request routes"}), 403

    data = request.get_json()
    status = data.get('status') # 'Accepted', 'Collected', 'Completed'

    if not status or status not in ['Pending', 'Accepted', 'Collected', 'Completed']:
         return jsonify({"error": "Invalid status parameter"}), 400

    success = db.update_request_status(
        request_id=request_id,
        status=status,
        recycler_id=session['user_id']
    )

    if success:
        return jsonify({"success": True, "message": "Request database updated successfully"}), 200
    return jsonify({"error": "Failed to process request update. Database processing error"}), 500

if __name__ == '__main__':
    # Start flask app. Run on port 5000 internally for deployment behind server proxy
    app.run(host='0.0.0.0', port=5000, debug=True)
