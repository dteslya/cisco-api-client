from oauthlib.oauth2 import BackendApplicationClient
from requests_oauthlib import OAuth2Session
from requests.auth import HTTPBasicAuth
from pprint import pprint

client_id = "***REMOVED***"
client_secret = "***REMOVED***"

auth = HTTPBasicAuth(client_id, client_secret)
client = BackendApplicationClient(client_id=client_id)
oauth = OAuth2Session(client=client)
token = oauth.fetch_token(
    token_url="https://cloudsso.cisco.com/as/token.oauth2", auth=auth
)

r = oauth.get(
    "https://api.cisco.com/supporttools/eox/rest/5/EOXByProductID/1/ASR1002,WS-C3550-12G"
)
pprint(r.json())
