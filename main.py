#!/usr/bin/env python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from oauthlib.oauth2 import BackendApplicationClient
from requests_oauthlib import OAuth2Session
from requests.auth import HTTPBasicAuth


app = FastAPI()

origins = ["http://localhost:3000/", "localhost:3000", "http://localhost"]

app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

eox_data = {
    "data": [
        {"EOLProductID": "", "EOXExternalAnnouncementDate": ""},
    ]
}


def get_eox_from_cisco(data):
    """Fetch EOX data from Cisco Support API"""
    print(data)
    client_id = "***REMOVED***"
    client_secret = "***REMOVED***"

    baseurl = "https://api.cisco.com/supporttools/eox/rest/5/EOXByProductID/1"

    auth = HTTPBasicAuth(client_id, client_secret)
    client = BackendApplicationClient(client_id=client_id)
    oauth = OAuth2Session(client=client)
    token = oauth.fetch_token(
        token_url="https://cloudsso.cisco.com/as/token.oauth2", auth=auth
    )

    response = oauth.get(baseurl + "/" + data["pids"])
    # pprint(r.json())
    return response.json()


@app.get("/eox/")
async def list_eox():
    """Show EOX data"""
    print("/eox endpoint called with GET method")
    response = eox_data
    print(response)
    return response


@app.post("/eox/")
async def submit_pids(pids: dict):
    """Submit device product number(s)"""
    print("/eox endpoint called with POST method")

    # Reset eox_data
    eox_data["data"].clear()
    
    fetched_data = get_eox_from_cisco(pids)
    for record in fetched_data["EOXRecord"]:
        new_entry = {
            "EOLProductID": record["EOLProductID"],
            "EOXExternalAnnouncementDate": record["EOXExternalAnnouncementDate"][
                "value"
            ],
        }
        eox_data["data"].append(new_entry)
    print(eox_data)
    response = {"data": ["EOX data fetched"]}
    return response
