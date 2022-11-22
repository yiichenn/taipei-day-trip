from flask import *
from flask import Flask,request,render_template,session,redirect,url_for, jsonify,make_response
import mysql.connector
import json

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345678",
    database="taipeidaytrip",
)
cursor=db.cursor(dictionary=True)


app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSON_SORT_KEYS'] = False

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

# attractions api

@app.route("/api/attractions")
def api():
	try:
		page = int(request.args.get("page",0))
		one_page=page*12
		keyword = request.args.get("keyword","")
		keyword1 = "%"+f"{keyword}"+"%"
		mycursor=db.cursor(dictionary=True)

		#取 13 筆，如果有 13 筆，就有下一頁。實際上只回應前 12 筆
		cursor.execute("SELECT * FROM attractions WHERE category=%s OR name LIKE  %s LIMIT %s,%s",(keyword,keyword1,one_page,13,))
		result=cursor.fetchall()
		if len(result) == 13: 
			nextPage = page+1
		else:
			nextPage = None
		
		final_data=[] 
		for i in range(0,len(result)-1):
			mycursor=db.cursor(dictionary=True)
			cursor.execute("SELECT * FROM attractions WHERE category=%s OR name LIKE  %s LIMIT %s,%s",(keyword,keyword1,one_page,12,))
			result=cursor.fetchall() 
			img=result[i]["images"]
			imgs=json.loads(img)
			result={
				"id": result[i]["id"],
				"name": result[i]["name"],
				"category": result[i]["category"],
				"description": result[i]["description"],
				"address": result[i]["address"],
				"transport": result[i]["transport"],
				"mrt": result[i]["mrt"],
				"latitude": result[i]["latitude"],
				"longitude": result[i]["longitude"],
				"images":imgs
			}
			final_data.append(result)
		return jsonify({"nextPage":nextPage,"data":final_data}),200
	except:
		return jsonify ({"error":True,"message":"伺服器內部錯誤"}),500

@app.route("/api/attractions/<attractionId>")
def attractionId(attractionId):
	try:
		mycursor=db.cursor(dictionary=True)
		sql=f"SELECT * FROM attractions WHERE id = {attractionId}"
		mycursor.execute(sql)
		result=mycursor.fetchone()
		mycursor.execute("SELECT * FROM attractions")
		record=mycursor.fetchall()
		if int(attractionId) <= len(record) and int(attractionId) > 0:
			img=result["images"]
			imgs=json.loads(img)
			result={
				"id": result["id"],
				"name": result["name"],
				"category": result["category"],
				"description": result["description"],
				"address": result["address"],
				"transport": result["transport"],
				"mrt": result["mrt"],
				"latitude": result["latitude"],
				"longitude": result["longitude"],
				"images":imgs
			}
			return jsonify({"data":result}),200
		else:
			return jsonify({"error":True,"message":"景點編號不正確"}),400
	except:
		return jsonify ({"error":True,"message":"伺服器內部錯誤"}),500
		

@app.route("/api/categories")
def categories():
	try:
		mycursor=db.cursor(dictionary=True)
		mycursor.execute("SELECT * FROM attractions")
		result=mycursor.fetchall()
		categories=[]
		for i in range(0,len(result)):
			category=result[i]["category"]
			categories.append(category)
		categories=list(dict.fromkeys(categories)) #刪掉重複的部分
		return jsonify({"data":categories}),200
	except:
		return jsonify ({"error":True,"message":"伺服器內部錯誤"}),500

if __name__ == '__main__':
	app.run(port=3000,debug=True)