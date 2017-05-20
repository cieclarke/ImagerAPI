'use strict'

const Promise = require("bluebird")
const _ = require("lodash")
const resize = require('./../resize')
const data = require('./../data')
const rename = require('./../rename')
const keyData = require('./../keyData')
const configOptions = require('./../configOptions.json')

const BUCKET = process.env.BUCKET;
const URL = process.env.URL;

module.exports.handler = (event, context, callback) => {

  const key = keyData(event.queryStringParameters.key)
  const size = key.size
  const folder = key.folder
  const originalKey = key.originalKey

  const configSizeItem = _.find(configOptions.sizeOptions, (item) => {
      return item.id == size 
  })
  
  const width = configSizeItem.width
  const newKey = rename(folder + "/" + originalKey, size)
  const resizePromise = resize(folder + "/" + originalKey, BUCKET, width, newKey)

  resizePromise.then((data) => {
    callback(null, {
      statusCode: '301',
      headers: {
        'location': `${URL}/${newKey}`,
        'content-type': 'image/jpeg',
        'content-disposition': 'inline'
      },
      body: ''
    })
  })

}
  