import os, config, urllib3.contrib.pyopenssl, urllib
from flask import Flask, render_template, request, jsonify
from yikyak import YikYakAPI
import pyak as pk

urllib3.contrib.pyopenssl.inject_into_urllib3()

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html', title='Yak Yik')

@app.route("/get_yaks", methods=['GET'])
def get_yaks():
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    
    global yakker
    yakker = pk.Yakker()
    location = pk.Location(lat, lng)
    yakker.update_location(location)

    global yyapi
    yyapi = YikYakAPI(yakker.id, lat, lng)
    yaks = yyapi.getMessages(lat, lng)
    return jsonify(yaks)

@app.route("/upvote", methods=['GET'])
def upvote():
    if request.method == 'GET':
        lat = str(round(float(request.args.get('lat')), 6))
        lng = str(round(float(request.args.get('lng')), 6))
        messageID = request.args.get('messageid')
    else:
        return "Only GET requests."

    response = yakker.upvote_yak(urllib.unquote(messageID)) #yyapi.likeMessage(messageID)

    return str(response)

@app.route("/downvote", methods=['GET'])
def downvote():
    if request.method == 'GET':
        lat = str(round(float(request.args.get('lat')), 6))
        lng = str(round(float(request.args.get('lng')), 6))
        messageID = request.args.get('messageid')
    else:
        return "Only GET requests."

    response = yakker.downvote_yak(urllib.unquote(messageID)) #yyapi.downvoteMessage(messageID)

    return str(response)

@app.route("/loc")
def loc():
    return render_template('loc.html')

@app.route("/postyak", methods=['POST'])
def postyak():
	message = request.form['message']
	handle = request.form['handle']
	lat = request.form['lat']
	lng = request.form['lng']

	if (handle == ""):
		handle = None

	yakker.post_yak(message) #yyapi.sendMessage(message, handle, False, lat, lng)

	return "Posted."

if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0')
