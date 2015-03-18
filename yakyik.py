from flask import Flask, render_template, request, jsonify
from yikyak import YikYakAPI

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html', title='YakYik')

@app.route("/get_yaks", methods=['GET', 'POST'])
def get_yaks():
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    
    yyapi = YikYakAPI(None, lat, lng)
    # yyapi.registerUser()
    yaks = yyapi.getMessages(lat, lng)
    return jsonify(yaks)

@app.route("/upvote", methods=['POST'])
def upvote():
	lat = request.form["lat"]
	lng = request.form["lng"]
	yyapi = YikYakAPI(None, lat, lng)
	yyapi.registerUser()
	messageID = request.form["messageID"]
	return str(yyapi.likeMessage(messageID))

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
