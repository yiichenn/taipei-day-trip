import mysql.connector
import json
from mysql.connector import Error
from mysql.connector import pooling

connection_pool = pooling.MySQLConnectionPool(
    pool_name="my_connection_pool",
    pool_size=5,
    pool_reset_session=True,
    host="localhost",
    user="root",
    password="12345678",
    database="taipeidaytrip"
)

attractions_table = """CREATE TABLE attractions(
                    id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY, 
                    name varchar(255) NOT NULL,
                    category varchar(255) NOT NULL, 
                    description varchar(3000) NOT NULL,
                    address varchar(255) NOT NULL, 
                    transport varchar(3000) NOT NULL,
                    mrt varchar(255),
                    latitude float NOT NULL,
                    longitude float NOT NULL,
                    images JSON NOT NULL
                    )"""
member_table = """CREATE TABLE members(
                id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY, 
                name  VARCHAR(255) NOT NULL,
                password  VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL
                )"""

def create_table(table_name):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        cursor.execute(table_name)
    except:
        print("Error while connecting to MySQL")
    finally:
        cursor.close()
        connection_object.close()

create_table(member_table)
def insert_attraction_data():
    try:
        with open("taipei-attractions.json", "r",encoding="utf-8") as file:
            #讀取 json 檔案
            data = json.load(file)
        data = data["result"]["results"]
        for x in data:
            images=x["file"]
            images=images.replace("JPG","jpg").split("jpg")
            # print(images)
            for i in images:
                #print(i)
                if i == "" or i[-1] != ".":
                    images.remove(i) 
            images=[str(x)+"jpg" for x in images]# 這個就是整理好的
            img=json.dumps(images)

            sql = 'INSERT INTO attractions (name, category, description, address, transport, mrt, latitude, longitude,images) VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s)'
            val = (x["name"],x["CAT"],x["description"],x["address"],x["direction"],x["MRT"],x["latitude"],x["longitude"],img)
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor()
            cursor.execute(sql, val)
            connection_object.commit()
    except:
        print("Error while connecting to MySQL")
    finally:
        cursor.close()
        connection_object.close()