# Cisco Support API client
This simple SPA allows you to retrieve End Of Life info about Cisco products. It uses [Cisco Support API](https://developer.cisco.com/site/support-apis/) under the hood, so first, you need to acquire access to that API. This process is covered in my [blog post](https://dteslya.engineer/using_cisco_support_api_with_postman/).

# Deployment
## Local
To run this app locally you need to start FastAPI backend and React frontend processes.

**Backend**  
1. Clone this repo somewhere on your computer: `git clone https://github.com/dteslya/cisco-api`
2. `cd cisco-api`
3. Install the required dependencies: `pip install -r requirements.txt`
4. Declare the environment vars:
   ```
   export ALLOWED_ORIGINS=["http://localhost:3000", http://localhost:3000/"]
   export CISCO_API_CLIENT_ID=your_client_id_here
   export CISCO_API_CLIENT_SECRET=your_client_secret_here
   ```
   For some reason, my frontend was unable to access the backend when I specified localhost URIs as an allowed origin. To mitigate this you can use `export ALLOWED_ORIGINS=["*"]`
5. Start the backend process: `uvicorn main:app --reload`

**Frontend**  
1. `cd client`
2. Create `.env.local` file and put the following line there: `REACT_APP_BACKEND_URL=http://localhost:8000`
3. Run `npm start`

## Heroku & Netlify
I host the backend on Heroku and the frontend on Netlify (both free accounts). The deployment process is pretty straightforward. Don't forget to specify environment variables in the dashboard. [Here](https://medium.com/better-programming/why-you-should-add-environment-variables-to-netlify-sites-bae57012cc74) is a good tutorial for Netlify, and [this](https://devcenter.heroku.com/articles/config-vars) is for Heroku.

# Usage
To perform a request you must enter one or more Cisco product numbers into the input field. Product numbers can be separated by commas and/or new lines. Using wildcards is also supported.
## Examples of valid requests:
* One PN
  `asr1001`
* Several PNs
  ```
  asr1001, cisco2911/k9
  ws-c6506-e
  ```
* Using wildcards:
  `asr10*, ws-c3550*`

# Known Issues
Currently, response pagination is not supported. If a Cisco Support API returns a paginated response, only the results from the first page will be fetched.