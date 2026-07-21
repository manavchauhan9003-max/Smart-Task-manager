import psycopg2

conn = psycopg2.connect(
    dbname="smart_task_manager",
    user="postgres",
    password="Manav@123",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()

# Fetch all tasks
cursor.execute("SELECT * FROM tasks")
all_tasks = cursor.fetchall()
print("All tasks:")
for row in all_tasks:
    print(row)

# Fetch only high priority tasks (parameterized, just like INSERT)
cursor.execute("SELECT * FROM tasks WHERE priority = %s", ("high",))
high_priority_tasks = cursor.fetchall()
print("\nHigh priority tasks:")
for row in high_priority_tasks:
    print(row)

cursor.close()
conn.close()