from flask import *
from api.connector import *
from flask import Blueprint

attraction_blueprint = Blueprint('attraction_blueprint',__name__)

# attractions api
@attraction_blueprint.route("/api/attractions")
def api():
	try:
		connection = get_connection()
		cursor = connection.cursor(dictionary=True)
		page = int(request.args.get("page",0))
		one_page=page*12
		keyword = request.args.get("keyword","")
		keyword1 = "%"+f"{keyword}"+"%"

		#取 13 筆，如果有 13 筆，就有下一頁。實際上只回應前 12 筆
		cursor.execute("SELECT * FROM attractions WHERE category=%s OR name LIKE  %s LIMIT %s,%s",(keyword,keyword1,one_page,13,))
		result=cursor.fetchall()
		if len(result) == 13: 
			nextPage = page+1
		else:
			nextPage = None
		
		final_data=[] 
		for i in range(0,len(result)-1):
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
	finally:
		cursor.close()
		connection.close()


@attraction_blueprint.route("/api/attractions/<attractionId>")
def attractionId(attractionId):
	try:
		connection = get_connection()
		cursor = connection.cursor(dictionary=True)
		sql=f"SELECT * FROM attractions WHERE id = {attractionId}"
		cursor.execute(sql)
		result=cursor.fetchone()
		cursor.execute("SELECT * FROM attractions")
		record=cursor.fetchall()
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
	finally:
		cursor.close()
		connection.close()

@attraction_blueprint.route("/api/categories")
def categories():
	try:
		connection = get_connection()
		cursor = connection.cursor(dictionary=True)
		cursor.execute("SELECT * FROM attractions")
		result=cursor.fetchall()
		categories=[]
		for i in range(0,len(result)):
			category=result[i]["category"]
			categories.append(category)
		categories=list(dict.fromkeys(categories)) #刪掉重複的部分
		return jsonify({"data":categories}),200
	except:
		return jsonify ({"error":True,"message":"伺服器內部錯誤"}),500
	finally:
		cursor.close()
		connection.close()