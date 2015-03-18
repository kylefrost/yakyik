from yikyak import YikYakAPI

yyapi = YikYakAPI(None, 30.4581497, -84.2723817)
yyapi.registerUser()
messageID = yyapi.sendMessage('test').get('yakID', None)

for x in range (0, 140):
    yyapi = YikYakAPI(None, 0, 0)
    yyapi.registerUser()
    print yyapi.likeMessage(messageID)
