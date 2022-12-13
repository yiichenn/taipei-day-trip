from flask import *
from flask import make_response
from api.connector import *
from flask import Blueprint
from flask_bcrypt import Bcrypt
import jwt

user_blueprint = Blueprint("user_blueprint",__name__)
bcrypt = Bcrypt()

@user_blueprint.route("/api/user",methods = ["POST"])
def redister():
    name = request.json["name"]
    email = request.json["email"]
    password = request.json["password"]
    hashed_password = bcrypt.generate_password_hash(password=password)
    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)
        sql = "SELECT * FROM members WHERE email = %s"
        val = (email,)
        cursor.execute(sql,val)
        result = cursor.fetchone()
        if result != None:
            return make_response(jsonify({"erroe":True,"message":"此 email 已被註冊"})),400
        else:
            sql = "INSERT INTO members(name,email,password) VALUES (%s,%s,%s)"
            val = (name,email,hashed_password)
            cursor.execute(sql,val)
            connection.commit()
            return make_response(jsonify({"ok":True})),200
    except:
        return  make_response(jsonify({"error":True,"message":"伺服器錯誤"})),500
    finally:
        cursor.close()
        connection.close()
@user_blueprint.route("/api/user/auth",methods = ["GET"])
def sing():
    token = request.cookies.get('token')
    if token == None:
        return make_response(jsonify(data={"data":None})),200
    else:
        user_data = jwt.decode(token, "secret", algorithms=["HS256"])
        return make_response(jsonify(data={"data":user_data})),200
@user_blueprint.route("/api/user/auth",methods = ["PUT","DELETE"])
def singin():
    if request.method == "PUT":
        try:
            token = request.cookies.get('token')
            email = request.json["email"]
            put_password = request.json["password"]
            connection = get_connection()
            cursor = connection.cursor(dictionary=True)
            sql = "SELECT id,name,email FROM members WHERE email = %s"
            val = (email,)
            cursor.execute(sql,val)
            user_data = cursor.fetchone()
            if user_data == None:
                return make_response(jsonify({"error":True,"message":"沒有此帳號，請重新輸入"})),400
            else:
                sql = "SELECT password FROM members WHERE email = %s"
                val = (email,)
                cursor.execute(sql,val)
                password=cursor.fetchone()
                hash_password = password["password"]
                check_password = bcrypt.check_password_hash(hash_password,put_password)
                if check_password == True:
                    token = jwt.encode(user_data,"secret",algorithm="HS256")
                    res = make_response(jsonify({"ok":True}),200)
                    res.set_cookie('token',token,max_age=604800)
                    return res
                else:
                    return make_response(jsonify({"error":True,"message":"密碼輸入錯誤"})),400
        except:
            return jsonify({"error":True,"message":"伺服器錯誤"}),500
        finally:
            cursor.close()
            connection.close()
    if request.method == "DELETE":
        response = make_response(jsonify({"ok": True}))
        response.set_cookie("token", "", max_age = -1)
        return response