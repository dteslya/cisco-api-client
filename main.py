#!/usr/bin/env python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from oauthlib.oauth2 import BackendApplicationClient
from requests_oauthlib import OAuth2Session
from requests.auth import HTTPBasicAuth
# from pprint import pprint

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
    response = eox_data
    print(response)
    return response


@app.post("/eox/")
async def eox(pids: dict):
    print("/eox endpoint called")
    fetched_data = get_eox_from_cisco(pids)
    # eox_data['data'] = fetched_data['EOXRecord']
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
