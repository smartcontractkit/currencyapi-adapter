const rp = require('request-promise')
const retries = process.env.RETRIES || 3
const delay = process.env.RETRY_DELAY || 1000

const requestRetry = (options, retries) => {
  return new Promise((resolve, reject) => {
    const retry = (options, n) => {
      return rp(options)
        .then(response => {
          if (response.body.error) {
            if (n === 1) {
              reject(response)
            } else {
              setTimeout(() => {
                retries--
                retry(options, retries)
              }, delay)
            }
          } else {
            return resolve(response)
          }
        })
        .catch(error => {
          if (n === 1) {
            reject(error)
          } else {
            setTimeout(() => {
              retries--
              retry(options, retries)
            }, delay)
          }
        })
    }
    return retry(options, retries)
  })
}

const createRequest = (input, callback) => {
  const endpoint = input.data.endpoint || 'convert'
  const url = 'https://currencyapi.net/api/v1/' + endpoint
  const amount = input.data.amount || '1'
  const from = input.data.from || 'EUR'
  const to = input.data.to || 'USD'

  const queryObj = {
    key: process.env.API_KEY,
    amount: amount,
    to: to,
    from: from
  }

  const options = {
    url: url,
    qs: queryObj,
    json: true,
    resolveWithFullResponse: true
  }
  requestRetry(options, retries)
    .then(response => {
      const result = JSON.parse(response.body.conversion.result)
      response.body.result = result
      callback(response.statusCode, {
        jobRunID: input.id,
        data: response.body,
        result,
        statusCode: response.statusCode
      })
    })
    .catch(error => {
      callback(error.statusCode, {
        jobRunID: input.id,
        status: 'errored',
        error,
        statusCode: error.statusCode
      })
    })
}

exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

module.exports.createRequest = createRequest
