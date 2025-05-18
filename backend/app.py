from flask import Flask, jsonify, request
import sqlite3

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect('database/screen_time.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usage_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            age_group TEXT NOT NULL,
            minutes_spent INTEGER NOT NULL,
            timestamp TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()


@app.route('/api/logs/<user_id>', methods=['GET'])
def get_logs(user_id):
    conn = sqlite3.connect('database/screen_time.db')
    cursor = conn.cursor()
    cursor.execute('SELECT age_group, minutes_spent, timestamp FROM usage_logs WHERE user_id = ? ORDER BY timestamp DESC', (user_id,))
    rows = cursor.fetchall()
    conn.close()
    logs = [{'age_group': row[0], 'minutes_spent': row[1], 'timestamp': row[2]} for row in rows]
    return jsonify(logs)


@app.route('/api/logs', methods=['POST'])
def add_log():
    data = request.json
    conn = sqlite3.connect('database/screen_time.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO usage_logs (user_id, age_group, minutes_spent, timestamp) 
        VALUES (?, ?, ?, ?)
    ''', (data['user_id'], data['age_group'], data['minutes_spent'], data['timestamp']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Log added successfully'}), 201


if __name__ == '__main__':
    init_db()
    app.run(debug=True)
