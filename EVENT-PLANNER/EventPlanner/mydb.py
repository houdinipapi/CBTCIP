import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error

# Load the environment variables
load_dotenv()

# Get MySQL credentials from environment variables
mysql_password = os.getenv("MYSQL_PASSWORD")

def create_database():
    try:
        # Connect to the default MySQL database
        connection = mysql.connector.connect(
            host = "localhost",
            user = "root",
            password = mysql_password,
        )


        # Create a cursor object using the cursor() method
        cursor = connection.cursor()

        # Create the new database
        cursor.execute("CREATE DATABASE IF NOT EXISTS EventPlanner")

        cursor.execute("USE EventPlanner")

        print("Database created successfully!")

    except Error as e:
        print(f"The error '{e}' occurred!")

    finally:
        # Close the database connection and cursor
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed!")


# Call the function to create the database
if __name__ == "__main__":
    create_database()