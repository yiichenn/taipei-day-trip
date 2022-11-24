import mysql.connector
import json

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345678",
    database="taipeidaytrip",
)
cursor=db.cursor()
    
cursor.execute ("CREATE TABLE attractions(id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY, name varchar(255) NOT NULL,category varchar(255) NOT NULL, description varchar(3000) NOT NULL,address varchar(255) NOT NULL, transport varchar(3000) NOT NULL,mrt varchar(255),latitude float NOT NULL,longitude float NOT NULL,images JSON NOT NULL)")


with open("taipei-attractions.json", "r",encoding="utf-8") as file:
    #讀取 json 檔案
    data = json.load(file)
data = data["result"]["results"]
for x in data:
    images=x["file"]
    images=images.replace("JPG","jpg").split("jpg")
    for i in images:
        #print(i)
        if i == "" or i[-1] != ".":
  	        images.remove(i)
       
    images=[str(x)+"jpg" for x in images]# 這個就是整理好的

    img=json.dumps(images)

    sql = 'INSERT INTO attractions (name, category, description, address, transport, mrt, latitude, longitude,images) VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s)'
    val = (x["name"],x["CAT"],x["description"],x["address"],x["direction"],x["MRT"],x["latitude"],x["longitude"],img)
    cursor.execute(sql, val)
    db.commit()
