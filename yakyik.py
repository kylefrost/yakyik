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

@app.route("/upvote", methods=['GET', 'POST'])
def upvote():
    if request.method == 'GET':
        lat = request.args.get('lat')
        lng = request.args.get('lng')
        messageID = request.args.get('messageid')[2:]

        #yyapi = YikYakAPI(None, lat, lng)
        #yyapi.registerUser()
        #print 'GET - messageID: {}'.format(messageID)
        for x in range (0, 25):
            yyapi = YikYakAPI(None, lat, lng)
            yyapi.registerUser()
            print 'MESSAGE ID: {}'.format(messageID)
            print yyapi.likeMessage(messageID)
        return "GET"
    else:
        lat = request.form['lat']
        lng = request.form['lng']
        messageID = request.form['messageid'][2:]

        yyapi = YikYakAPI(None, 0, 0)
        yyapi.registerUser()
        print 'POST - messageID: {}, lat: {}, lng: {}'.format(messageID, lat, lng)
        for x in range (0, 25):
            print yyapi.likeMessage(messageID)
        return "POST"

if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0')
