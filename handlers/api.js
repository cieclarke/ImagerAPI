const Promise = require("bluebird")
const AWS = require('aws-sdk')
const _ = require('lodash')
const configOptions = require('./../configOptions.json')
const rename = require('./../rename.js')
const keyData = require('./../keyData')
const KEY = process.env.ACCESSKEY;
const SECRET = process.env.SECRET;

module.exports.handler = (event, context, callback) => {

    AWS.config.setPromisesDependency(Promise)

    const credentials = new AWS.Credentials(
        KEY,
        SECRET,
        null)

    const s3 = new AWS.S3({credentials: credentials, signatureVersion: 'v4'})

    const listObjectPromise = s3.listObjects({
        Bucket: process.env.BUCKET
    }).promise()

    listObjectPromise.then(function(data){

        const albumData = Albumify(data)

        callback(null, {
            statusCode: '200',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(albumData)
        })
    })

}

function Albumify(data) {

    const albumPattern = new RegExp('^[\\w\\s]+\\/$')
    var albumData = {}

    var albumList = _.chain(data.Contents)
    .filter((item) => {  
        return albumPattern.test(item.Key)
    })
    .map('Key').value()
    
    _.forEach(albumList, (album, index) => {
        
        const picPattern = new RegExp('^' + album + '[\\w\\s]+\.(JPG|jpg)$')
        var name = album.substring(0, album.length - 1)
        var picObj = {}

        var picList = _.chain(data.Contents)
            .filter((item) => {
                return picPattern.test(item.Key)
            })
            .map('Key').value()
        
        _.forEach(picList, (pic, index) => {
            const picName = getPicFileName(pic)
            var picData = []
            _.forEach(configOptions.sizeOptions, (configOption, index) => {
                const newKey = rename(pic, configOption.id)
                const picItem = {}
                picItem[configOption.name] = process.env.URL + "/" + newKey
                picData.push(picItem)
            })
            picObj[picName] = picData
        })

        albumData[name] = picObj
    })

    return albumData
}

function getPicFileName(filename) {
    const picPattern = new RegExp('\/([\\w\\s]+)\.(JPG|jpg)$') 
    var result = filename.match(picPattern);
    return result[1]
}