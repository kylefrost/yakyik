from flask import Flask, render_template, request, jsonify
from yikyak import YikYakAPI
import api as yy

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html', title='Yak Yik')

@app.route("/get_yaks", methods=['GET', 'POST'])
def get_yaks():
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    yyapi = YikYakAPI(None, lat, lng)
    # yyapi.registerUser()
    yaks = yyapi.getMessages(lat, lng)
    return jsonify(yaks)

@app.route("/upvote", methods=['GET', 'POST'])
def upvote():
    if request.method == 'GET':
        lat = request.args.get('lat')
        lng = request.args.get('lng')
        messageID = request.args.get('messageid')
    else:
        lat = request.form['lat']
        lng = request.form['lng']
        messageID = request.form['messageid']

    #for x in range (0, 25):
        #yyapi = YikYakAPI(None, lat, lng)
        #yyapi.registerUser()
        #print 'POST - messageID: {}, lat: {}, lng: {}'.format(messageID, lat, lng)
        #params = (('messageID', messageID),)
        #yakID = yyapi.get('yakID', params)
        #print yakID
        #print yyapi.likeMessage(messageID)
    
    yyapi = YikYakAPI(None, lat, lng)
    yyapi.registerUser()
    userID = yyapi.userID
    print userID

    coords = yy.Location(lat, lng)

    yakker = yy.Yakker(userID, coords, False)

    upvoted = yakker.upvote_yak(messageID)

    return str(upvoted.status_code) if upvoted else "Didn't work"

if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0')
