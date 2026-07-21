import psycopg2

conn = psycopg2.connect(
    dbname="smart_task_manager",
    user="postgres",
    password="Manav@123",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()

# Show all tasks before deleting
cursor.execute("SELECT id, title FROM tasks")
print("Before delete:")
for row in cursor.fetchall():
    print(row)

# Delete task with id = 35 ("Write report")
cursor.execute("DELETE FROM tasks WHERE id = %s", (3,))
print("\nRows affected:", cursor.rowcount)

conn.commit()

# Show all tasks after deleting
cursor.execute("SELECT id, title FROM tasks")
print("\nAfter delete:")
for row in cursor.fetchall():
    print(row)

cursor.close()
conn.close()