# Waste2Wealth Python Flask & MySQL Backend

This is the fully compliant backend service for the **Waste2Wealth Exchange Portal**, utilizing **Python Flask** and **MySQL** with strict session-based authentication and secure transaction rewards.

## Project Structure
```text
flask-backend/
├── app.py             # Main Flask routing service and endpoints
├── db.py              # MySQL queries, transactional rewards, and CRUD utilities
├── schema.sql         # Database schema defining table structures and indexing
└── README.md          # Setup and configuration guidelines (this file)
```

## Features Implemented
1. **User Registration & Hashing**: Inserts users securely with Werkzeug-hashed passwords.
2. **Session Authentication**: Stateful session cookies keep track of logged-in credentials safely.
3. **Waste Request Submission**: Standard sellers submit scheduling info securely attached to their account.
4. **Recycler Request Management**: Recyclers view global requests and update tracking logs (`Accepted` -> `Collected` -> `Completed`).
5. **Reward Points System**: Transactions calculate point allocations (10 pt/kg) and environmental metrics dynamically upon receipt completion.

---

## Setup & Installations

### Prerequisites
1. Installed **Python (3.8+)**
2. Installed **MySQL Server**

### Step 1: Install Dependencies
Install Flask along with dependencies for Cross-Origin Resource Sharing (CORS) and raw MySQL driver interactions:
```bash
pip install flask flask-cors pymysql cryptography
```

### Step 2: Initialize MySQL Database Schema
Log into your MySQL terminal and import `schema.sql` to build tables and key indices:
```bash
mysql -u root -p < schema.sql
```

### Step 3: Configure Environment Variables
Customize database connections by exporting standard configurations:
```bash
export DB_HOST="localhost"
export DB_USER="root"
export DB_PASSWORD="your-mysql-password"
export DB_NAME="waste2wealth"
```

### Step 4: Run the Flask API Server
Start the development server:
```bash
python app.py
```
*The endpoint will boot locally on **`http://localhost:5000`**.*

---

## API Documentation Quick Reference

| Endpoint | Method | Role | Payload Parameters | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/register` | `POST` | Anon | `name`, `email`, `password`, `phone`, `role` | Register new seller or recycler |
| `/api/login` | `POST` | Anon | `email`, `password` | Authenticate and starts cookie session |
| `/api/logout` | `POST` | Auth | *None* | Clear current tracking session state |
| `/api/me` | `GET` | Auth | *None* | Retrieve user's current session & updated metrics |
| `/api/requests` | `GET` | Auth | *None* | Get requests matching user scope or region list |
| `/api/requests/create` | `POST` | User | `wasteType`, `quantity`, `pickupAddress`, `preferredPickupDate` | Schedule a pickup transaction |
| `/api/requests/<id>/status` | `PUT` | Recycler | `status` (`Accepted` / `Collected` / `Completed`) | Logistics status update & point distribution |
