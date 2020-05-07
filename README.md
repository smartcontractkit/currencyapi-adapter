# Chainlink CurrencyAPI External Adapter

**This adapter has moved to our [external adapters monorepo](https://github.com/smartcontractkit/external-adapters-js)!**

## Input Params

- `from`: The currency symbol to convert from
- `to`: The currency symbol to convert to
- `amount`: The amount to convert (default: 1)

## Adapter Output

```
{
 "jobRunID": "278c97ffadb54a5bbb93cfec5f7b5503",
 "data": {
  "valid": true,
  "timestamp": 1576598798,
  "conversion": {
   "amount": "1",
   "from": "JPY",
   "to": "USD",
   "result": "0.009130"
  },
  "result": 0.00913
 },
 "result": 0.00913,
 "statusCode": 200
}
```

## Install

```bash
npm install
```

## Test

```bash
npm test
```

## Create the zip

```bash
zip -r cl-currencyapi.zip .
```

## Docker

If you wish to use Docker to run the adapter, you can build the image by running the following command:

```bash
docker build . -t currencyapi-adapter
```

Then run it with:

```bash
docker run -p 8080:8080 -e API_KEY='YOUR_API_KEY' -it currencyapi-adapter:latest
```

## Install to AWS Lambda

- In Lambda Functions, create function
- On the Create function page:
  - Give the function a name
  - Use Node.js 8.10 for the runtime
  - Choose an existing role or create a new one
  - Click Create Function
- Under Function code, select "Upload a .zip file" from the Code entry type drop-down
- Click Upload and select the `cl-currencyapi.zip` file
- Handler should remain index.handler
- Add the environment variable (repeat for all environment variables):
  - Key: API_KEY
  - Value: Your_API_key
- Save


## Install to GCP

- In Functions, create a new function, choose to ZIP upload
- Click Browse and select the `cl-currencyapi.zip` file
- Select a Storage Bucket to keep the zip in
- Function to execute: gcpservice
- Click More, Add variable (repeat for all environment variables)
  - NAME: API_KEY
  - VALUE: Your_API_key
