# live_detection.py - Live Detection and SQLite Sync
import cv2
from deepface import DeepFace
import sqlite3
import datetime
import time

# Database Configuration
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

# Initialize DB
init_db()

# Screen Time Limits
limits = {'below_10': 0, 'age_10_15': 180, 'age_15_plus': 420}
tracker = {'below_10': 0, 'age_10_15': 0, 'age_15_plus': 0}

# Real-time Detection
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    faces = DeepFace.detectFace(frame, detector_backend='opencv')
    if faces is not None:
        analysis = DeepFace.analyze(frame, actions=['age'], enforce_detection=False)
        age = analysis['age']

        if age < 10:
            age_group = 'below_10'
        elif 10 <= age <= 15:
            age_group = 'age_10_15'
        else:
            age_group = 'age_15_plus'

        tracker[age_group] += 1

        if tracker[age_group] >= limits[age_group]:
            print(f"🔒 Screen Locked for age group: {age_group}")
            timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            conn = sqlite3.connect('database/screen_time.db')
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO usage_logs (user_id, age_group, minutes_spent, timestamp)
                VALUES (?, ?, ?, ?)
            ''', ('user_123', age_group, tracker[age_group], timestamp))
            conn.commit()
            conn.close()
            break

    cv2.imshow('Live Detection', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
