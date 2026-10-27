
import os
import sqlite3
import hmac
from pathlib import Path
from datetime import datetime, timezone
from functools import wraps

from flask import Flask, request, jsonify, session
from flask_cors import CORS

app = Flask(__name__)

app.secret_key = os.environ.get("FLASK_SECRET_KEY")
if not app.secret_key:
    raise RuntimeError("FLASK_SECRET_KEY is missing.")

app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=True,
)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "https://ian-ecra.vercel.app",
                "http://localhost:3001",
                "http://127.0.0.1:3001",
                "http://localhost:5173",
                "http://127.0.0.1:5173",
            ]
        }
    },
    supports_credentials=True,
)

# SQLite is suitable for local development only.
# Use a persistent hosted database for production.
DATABASE = Path(__file__).resolve().with_name("responses.db")


def get_db_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with get_db_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS responses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                answer TEXT NOT NULL
                    CHECK (answer IN ('yes', 'maybe')),
                created_at TEXT NOT NULL
            )
        """)


# Ensure the table exists when the Flask module is loaded.
initialize_database()


def admin_required(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        if not session.get("admin_logged_in"):
            return jsonify({"error": "Please log in first."}), 401
        return function(*args, **kwargs)
    return wrapper


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "success",
        "message": "Ian's website API is running!"
    })


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request."}), 400

    username = os.environ.get("ADMIN_USERNAME")
    password = os.environ.get("ADMIN_PASSWORD")

    if not username or not password:
        return jsonify({"error": "Login is not configured."}), 500

    submitted_username = data.get("username", "")
    submitted_password = data.get("password", "")

    if not isinstance(submitted_username, str) or not isinstance(
        submitted_password, str
    ):
        return jsonify({"error": "Invalid credentials."}), 401

    if not (
        hmac.compare_digest(submitted_username, username)
        and hmac.compare_digest(submitted_password, password)
    ):
        return jsonify({"error": "Incorrect username or password."}), 401

    session.clear()
    session["admin_logged_in"] = True
    return jsonify({"message": "Login successful."})


@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully."})


@app.route("/api/session", methods=["GET"])
def check_session():
    return jsonify({
        "logged_in": bool(session.get("admin_logged_in"))
    })


@app.route("/api/responses", methods=["POST"])
def save_response():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "A JSON object is required."}), 400

    answer = data.get("answer")
    if answer not in ("yes", "maybe"):
        return jsonify({
            "error": "Answer must be 'yes' or 'maybe'."
        }), 400

    created_at = datetime.now(timezone.utc).isoformat()

    with get_db_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO responses (answer, created_at)
            VALUES (?, ?)
            """,
            (answer, created_at),
        )
        response_id = cursor.lastrowid

    return jsonify({
        "status": "success",
        "message": "Response saved successfully!",
        "response_id": response_id,
    }), 201


@app.route("/api/responses", methods=["GET"])
@admin_required
def get_responses():
    with get_db_connection() as connection:
        rows = connection.execute("""
            SELECT id, answer, created_at
            FROM responses
            ORDER BY id DESC
        """).fetchall()

    return jsonify([
        {
            "id": row["id"],
            "answer": row["answer"],
            "created_at": row["created_at"],
        }
        for row in rows
    ])


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)


