import psycopg2

conn = psycopg2.connect(
    dbname="smart_task_manager",
    user="postgres",
    password="Manav@123",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()

# Show the row before updating
cursor.execute("SELECT id, priority, updated_at FROM tasks WHERE id = %s", (1,))
print("Before update:", cursor.fetchone())

# Update priority, and manually bump updated_at ourselves
cursor.execute(
    "UPDATE tasks SET priority = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
    ("medium", 1)
)
conn.commit()

# Show the row after updating
cursor.execute("SELECT id, priority, updated_at FROM tasks WHERE id = %s", (1,))
print("After update:", cursor.fetchone())

cursor.close()
conn.close()
