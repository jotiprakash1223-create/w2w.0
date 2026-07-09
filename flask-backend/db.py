import pymysql
from werkzeug.security import generate_password_hash, check_password_hash

# Database Configuration Helper
class Waste2WealthDB:
    def __init__(self, host='localhost', user='root', password='', database='waste2wealth'):
        self.host = host
        self.user = user
        self.password = password
        self.database = database

    def get_connection(self):
        """Standard raw driver connection to MySQL"""
        return pymysql.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.database,
            cursorclass=pymysql.cursors.DictCursor
        )

    def register_user(self, name, email, password, phone=None, role='user', company_name=None):
        """
        Inserts a new user into the database securely hashing the password
        SQL QUERY: INSERT INTO users ...
        """
        password_hash = generate_password_hash(password)
        conn = self.get_connection()
        try:
            with conn.cursor() as cursor:
                sql = """
                    INSERT INTO users 
                    (name, email, password_hash, phone, role, company_name) 
                    VALUES (%s, %s, %s, %s, %s, %s)
                """
                cursor.execute(sql, (name, email.lower(), password_hash, phone, role, company_name))
            conn.commit()
            return True
        except pymysql.MySQLError as e:
            print(f"Database registration error: {e}")
            return False
        finally:
            conn.close()

    def authenticate_user(self, email, password):
        """
        Retrieves user credentials and returns user details if passwords match
        SQL QUERY: SELECT * FROM users WHERE email = %s
        """
        conn = self.get_connection()
        try:
            with conn.cursor() as cursor:
                sql = "SELECT * FROM users WHERE email = %s"
                cursor.execute(sql, (email.lower(),))
                user = cursor.fetchone()
                if user and check_password_hash(user['password_hash'], password):
                    # Clean password hash before transferring session data
                    user.pop('password_hash', None)
                    return user
            return None
        except pymysql.MySQLError as e:
            print(f"Database auth error: {e}")
            return None
        finally:
            conn.close()

    def create_pickup_request(self, user_id, waste_type, quantity, pickup_address, contact_number, preferred_pickup_date):
        """
        Inserts a scheduled waste collection pickup request
        SQL QUERY: INSERT INTO waste_requests ...
        """
        conn = self.get_connection()
        try:
            with conn.cursor() as cursor:
                sql = """
                    INSERT INTO waste_requests 
                    (user_id, waste_type, quantity, pickup_address, contact_number, preferred_pickup_date, status) 
                    VALUES (%s, %s, %s, %s, %s, %s, 'Pending')
                """
                cursor.execute(sql, (user_id, waste_type, quantity, pickup_address, contact_number, preferred_pickup_date))
            conn.commit()
            return True
        except pymysql.MySQLError as e:
            print(f"Database request creation error: {e}")
            return False
        finally:
            conn.close()

    def get_requests(self, user_id=None, role='user'):
        """
        Fetches waste pickup requests depending on role (individuals see theirs, recyclers see all)
        SQL QUERY: SELECT * FROM waste_requests JOIN users ON ...
        """
        conn = self.get_connection()
        try:
            with conn.cursor() as cursor:
                if role == 'recycler':
                    # Join with user table to extract owner name
                    sql = """
                        SELECT r.*, u.name as user_name 
                        FROM waste_requests r
                        JOIN users u ON r.user_id = u.id
                        ORDER BY r.created_at DESC
                    """
                    cursor.execute(sql)
                else:
                    sql = """
                        SELECT r.*, u.name as user_name 
                        FROM waste_requests r
                        JOIN users u ON r.user_id = u.id
                        WHERE r.user_id = %s
                        ORDER BY r.created_at DESC
                    """
                    cursor.execute(sql, (user_id,))
                return cursor.fetchall()
        except pymysql.MySQLError as e:
            print(f"Database read requests error: {e}")
            return []
        finally:
            conn.close()

    def update_request_status(self, request_id, status, recycler_id=None):
        """
        Updates status of request. If status becomes 'Completed', awards Reward Points
        and Eco Metrics to the seller, and adds earnings/metrics to the recycler.
        SQL QUERY: UPDATE waste_requests SET status = ...
        """
        conn = self.get_connection()
        try:
            conn.begin() # Start transaction to handle request list and reward allocation safely
            with conn.cursor() as cursor:
                # 1. Fetch current request info to calculate reward allocation
                req_sql = "SELECT * FROM waste_requests WHERE id = %s"
                cursor.execute(req_sql, (request_id,))
                request = cursor.fetchone()
                if not request:
                    raise Exception("Request not found")

                # 2. Update Status
                status_sql = "UPDATE waste_requests SET status = %s WHERE id = %s"
                cursor.execute(status_sql, (status, request_id))

                # 3. Allocation logic upon Completion
                if status == 'Completed' and request['status'] != 'Completed':
                    qty = float(request['quantity'])
                    points_earned = int(qty * 10)
                    co2 = qty * 2.40
                    water = qty * 12.00
                    trees = int(qty / 3.00) or 1
                    
                    # Seller Allocation SQL
                    seller_sql = """
                        UPDATE users 
                        SET reward_points = reward_points + %s,
                            co2_saved = co2_saved + %s,
                            water_saved = water_saved + %s,
                            trees_planted = trees_planted + %s
                        WHERE id = %s
                    """
                    cursor.execute(seller_sql, (points_earned, co2, water, trees, request['user_id']))

                    # Recycler Earnings SQL
                    if recycler_id:
                        pay_earned = qty * 0.85
                        recycler_sql = """
                            UPDATE users 
                            SET earnings = earnings + %s,
                                co2_saved = co2_saved + %s,
                                water_saved = water_saved + %s,
                                trees_planted = trees_planted + %s
                            WHERE id = %s
                        """
                        cursor.execute(recycler_sql, (pay_earned, co2, water, trees, recycler_id))

            conn.commit()
            return True
        except Exception as e:
            conn.rollback()
            print(f"Database error in status processing: {e}")
            return False
        finally:
            conn.close()

    def get_user_stats(self, user_id):
        """
        Fetches updated user attributes and environmental metrics
        SQL QUERY: SELECT * FROM users WHERE id = %s
        """
        conn = self.get_connection()
        try:
            with conn.cursor() as cursor:
                sql = "SELECT id, name, email, phone, role, reward_points, co2_saved, trees_planted, water_saved, company_name, rating, earnings FROM users WHERE id = %s"
                cursor.execute(sql, (user_id,))
                return cursor.fetchone()
        except pymysql.MySQLError as e:
            print(f"Database stats retrieval error: {e}")
            return None
        finally:
            conn.close()
# End of db.py
