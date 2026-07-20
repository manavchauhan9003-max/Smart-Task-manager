import psycopg2

conn = psycopg2.connect(
    dbname="smart_task_manager",
    user="postgres",
    password="Manav@123",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()

cursor.execute(
    "INSERT INTO tasks(title, description, priority) VALUES (%s, %s, %s)",
    ("Learn PostgreSQL", "Understand raw SQL before ORMs", "high")
)

conn.commit()

print("Task inserted successfully")

cursor.close()
conn.close()