#!/usr/bin/env python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from oauthlib.oauth2 import BackendApplicationClient
from requests_oauthlib import OAuth2Session
from requests.auth import HTTPBasicAuth
import os
import json

# Get env config vars
ALLOWED_ORIGINS = json.loads(os.environ["ALLOWED_ORIGINS"])
CISCO_API_CLIENT_ID = os.getenv("CISCO_API_CLIENT_ID")
CISCO_API_CLIENT_SECRET = os.getenv("CISCO_API_CLIENT_SECRET")

app = FastAPI()

#origins = ["http://localhost:3000/", "localhost:3000", "http://localhost"]
print(ALLOWED_ORIGINS)

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
        {
            "EOLProductID": "",
            "EOXExternalAnnouncementDate": "",
            "EndOfSaleDate": "",
            "LastDateOfSupport": "",
            "MigrationProductName": "",
        },
    ]
}


def get_eox_from_cisco(data):
    """Fetch EOX data from Cisco Support API"""
    # client_id = "***REMOVED***"
    # client_secret = "***REMOVED***"

    baseurl = "https://api.cisco.com/supporttools/eox/rest/5/EOXByProductID/1"

    auth = HTTPBasicAuth(CISCO_API_CLIENT_ID, CISCO_API_CLIENT_SECRET)
    client = BackendApplicationClient(client_id=CISCO_API_CLIENT_ID)
    oauth = OAuth2Session(client=client)
    token = oauth.fetch_token(
        token_url="https://cloudsso.cisco.com/as/token.oauth2", auth=auth
    )

    response = oauth.get(baseurl + "/" + data["pids"])
    return response.json()


@app.get("/eox/")
async def list_eox():
    """Show EOX data"""
    response = eox_data
    print(response)
    return response


@app.post("/eox/")
async def submit_pids(pids: dict):
    """Submit device product number(s) to Cisco Support API"""

    # Reset eox_data
    eox_data["data"].clear()

    fetched_data = get_eox_from_cisco(pids)
    for record in fetched_data["EOXRecord"]:
        # If PID is invalid or there is no EOL announced return error
        # description instead of EOL date
        if "EOXError" in record:
            new_entry = {
                "EOLProductID": record["EOXInputValue"],
                "EOXExternalAnnouncementDate": record["EOXError"]["ErrorDescription"],
                "EndOfSaleDate": "N/A",
                "LastDateOfSupport": "N/A",
                "MigrationProductName": "N/A",
            }
        else:
            new_entry = {
                "EOLProductID": record["EOLProductID"],
                "EOXExternalAnnouncementDate": record["EOXExternalAnnouncementDate"][
                    "value"
                ],
                "EndOfSaleDate": record["EndOfSaleDate"]["value"],
                "LastDateOfSupport": record["LastDateOfSupport"]["value"],
                "MigrationProductName": record["EOXMigrationDetails"][
                    "MigrationProductId"
                ]
                + record["EOXMigrationDetails"]["MigrationProductName"],
            }
        eox_data["data"].append(new_entry)
    response = {"data": ["EOX data fetched"]}
    return response
