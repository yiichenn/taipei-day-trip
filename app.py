from flask import *
from api.connector import *
from api.attraction import attraction_blueprint
from api.user import *


app=Flask(__name__,static_folder="static", static_url_path="/static")
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


app.register_blueprint(attraction_blueprint)
app.register_blueprint(user_blueprint)


if __name__ == '__main__':
	app.run(host="0.0.0.0",port=3000,debug=True)