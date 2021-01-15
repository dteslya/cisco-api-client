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

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


def get_eox_from_cisco(data):
    """Fetch EOX data from Cisco Support API"""

    baseurl = "https://api.cisco.com/supporttools/eox/rest/5/EOXByProductID/1"

    auth = HTTPBasicAuth(CISCO_API_CLIENT_ID, CISCO_API_CLIENT_SECRET)
    client = BackendApplicationClient(client_id=CISCO_API_CLIENT_ID)
    oauth = OAuth2Session(client=client)
    token = oauth.fetch_token(
        token_url="https://cloudsso.cisco.com/as/token.oauth2", auth=auth
    )

    response = oauth.get(baseurl + "/" + data["pids"])
    return response.json()


@app.post("/eox/")
async def submit_pids(pids: dict):
    """Submit device product number(s) to Cisco Support API"""

    eox_data = {"data": []}

    fetched_data = get_eox_from_cisco(pids)
    print(fetched_data["PaginationResponseRecord"])
    key = 0
    for record in fetched_data["EOXRecord"]:
        # If PID is invalid or there is no EOL announced return error
        # description instead of EOL date
        key += 1
        if "EOXError" in record:
            new_entry = {
                "key": key,
                "EOLProductID": record["EOXInputValue"],
                "EOXExternalAnnouncementDate": record["EOXError"]["ErrorDescription"],
                "EndOfSaleDate": "N/A",
                "LastDateOfSupport": "N/A",
                "MigrationProductName": "N/A",
            }
        else:
            new_entry = {
                "key": key,
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
    response = eox_data["data"]
    return response
