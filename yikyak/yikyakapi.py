import uuid
import time
import json
from requests import Request, Session
from urlparse import urlsplit, urlunsplit, urljoin
from urllib import unquote, quote_plus
from hashlib import sha1
import hmac


class YikYakAPI:
    baseURL = 'https://us-central-api.yikyakapi.net/api/'
    key = 'F7CAFA2F-FE67-4E03-A090-AC7FFF010729'

    def __init__(self, userID=None, latitude=0, longitude=0):
        self.session = Session()
        # self.userID = userID if userID else str(uuid.uuid4()).upper()


        self.latitude = latitude
        self.longitude = longitude
        self.session.headers = {'user-agent': 'Yik Yak/2.3.4 (iPhone; iOS 8.3; Scale/3.00)', 'accept-language': 'en;q=1', 'accept-encoding': 'gzip, deflate', 'connection': 'keep-alive'}

        if userID is None:
            self.userID = str(uuid.uuid4()).upper()
            self.registerUser()
        else:
            self.userID = userID
        print "\nGenerated userID: {}\n".format(self.userID)

    def send(self, req):
        req.params = req.params if req.params else ()
        messageID = ([param for param in req.params if param[0] == 'messageID'] + [None])[0]
        if messageID:
            req.params = ((messageID[0], messageID[1]),)
            req.params += (('userID', self.userID),)
        else:
            req.params = (('userID', self.userID),)
        req.params += (('lat', self.latitude),)
        req.params += (('long', self.longitude),)
        req.params += (('userLat', self.latitude),)
        req.params += (('userLong', self.longitude),)
        req.params += (('version', '2.3.4'),)
        req.params += (('horizontalAccuracy', '65.000000'),)
        req.params += (('verticalAccuracy', '10.000000'),)
        req.params += (('altitude', '50.000000'),)
        req.params += (('floorLevel', '0'),)
        req.params += (('speed', '-1.000000'),)
        req.params += (('course', '-1.000000'),)
        parts = urlsplit(req.prepare().url)
        path = urlunsplit(map(lambda x: x if parts.index(x) > 1 else '', parts))
        #if messageID:
        #    path += '&messageID=' + messageID[1]
        salt = str(int(time.time()))
        hashed = hmac.new(self.key, path + salt, sha1)
        hash = hashed.digest().encode('base64').rstrip('\n')
        req.params += (('salt', salt),)
        req.params += (('hash', hash),)
        print "\nRequest Parameters: {}\n".format(req.params)
        prepped = self.session.prepare_request(req)
        #if messageID:
        #    prepped.url = prepped.url.replace('&salt', '&messageID=' + messageID[1] + '&salt')
        print "\nPrepped URL: {}\n".format(prepped.url)
        response = self.session.send(prepped)
        print response.url
        pending = self.session.cookies.pop('pending', None)
        if (response.headers['content-type'] == 'application/json'):
            return response.json()
        elif pending:
            return json.loads(unquote(pending))

    def get(self, endpoint, params=None):
        url = urljoin(self.baseURL, endpoint)
        req = Request('GET', url, params=params)
        return self.send(req)

    def post(self, endpoint, params=()):
        params = (('userID', self.userID),) + params
        url = urljoin(self.baseURL, endpoint)
        req = Request('POST', url, data=list(params))
        return self.send(req)

    def registerUser(self):
        return self.post('registerUser')

    def getMessages(self, lat=None, long=None):
        params = (('lat', lat if lat else self.latitude),)
        params += (('long', long if long else self.longitude),)
        return self.get('getMessages', params)

    def getMyRecentYaks(self):
        return self.get('getMyRecentYaks')

    def getComments(self, messageID):
        return self.get('getComments', (('messageID', messageID),))

    def downvoteMessage(self, messageID):
        return self.get('downvoteMessage', (('messageID', messageID),))

    def likeMessage(self, messageID):
        return self.get('likeMessage', (('messageID', messageID),))

    def sendMessage(self, message, handle=None, hidePin=False, lat=None, long=None):
        params = (('lat', lat if lat else self.latitude),)
        params += (('long', long if long else self.longitude),)
        params += (('message', message),)
        params += (('handle', handle),) if handle else ()
        #params += (('hidePin', 1 if hidePin else 0),)
        params += (('hidePin', 1),)
        return self.post('sendMessage', params)




