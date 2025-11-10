Analytics Dashboard for Core Outline
-

## Environment Variables
To configure the environment variables, create a `.env` file in the root directory.
You can use the `.env.example` file as a template and the following mapping as your guide.

### Port to CNAME Mappings

| Endpoint       | Development           | Production                       |
|----------------|-----------------------|----------------------------------|
| BASE_URL       | http://localhost:8080 | https://www.coreoutline.com      |
| DASHBOARD_URL  | http://localhost:8000 | https://app.coreoutline.com      |
| DATA_API       | http://localhost:5000 | https://data.coreoutline.com     |
| ACCOUNTS_API   | http://localhost:4000 | https://api.coreoutline.com      |
| PAYMENTS_API   | http://localhost:6000 | https://payments.coreoutline.com |
| STREAMS_API    | http://localhost:3000 | https://streams.coreoutline.com  |

#### Note: 
- **data.coreoutline.com** to be renamed to **api.coreoutline.com**
- **accounts.coreoutline.com** to be renamed to **accounts.coreoutline.com**
