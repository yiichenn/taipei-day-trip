import mysql.connector
from mysql.connector import Error
from mysql.connector import pooling
def get_connection():
    connection_pool = pooling.MySQLConnectionPool(pool_name="my_connection_pool",
                                            pool_size=5,
                                            host="localhost",
                                            user="root",
                                            password="12345678",
                                            database="taipeidaytrip")
    connection = connection_pool.get_connection()
    return connection