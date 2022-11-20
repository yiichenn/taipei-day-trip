import mysql.connector
import json

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345678"
    database="TaipeiDayTrip"

)
cursor=db.cusor()
    

with open("taipei-attractions.json", "r",encoding="utf-8") as file:
    #讀取 json 檔案
    data = json.load(file)
data = data["result"]["results"]

for x in data:
    print(x)