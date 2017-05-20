'use strict'

const Promise = require("bluebird")
const AWS = require('aws-sdk')
const im = require('imagemagick');
const fs = require('fs')
const KEY = process.env.ACCESSKEY;
const SECRET = process.env.SECRET;

function ResizeImage(img, width){
    
    return new Promise((resolve, reject) => {

        im.resize({
            srcData: img,
            width: width
        }, (err, out, stderr) => {
            if(err) {
                reject('error: im.resize')
            }

            resolve(new Buffer(out, 'binary'))

        })
    })
}

function PutImage(imageKey, bucket, image, s3){

    s3.putObject({
        Bucket: bucket,
        Key: imageKey,
        Body: image,
        ContentType: 'image/jpeg',
        ContentDisposition: 'inline'
    }, (err, data) => {
        if(err) {
            console.log('error: s3.putObject')
            console.log(err)
        }
    })
}

module.exports = (imageKey, bucket, width, newImageKey) => {
    
    AWS.config.setPromisesDependency(Promise)

    const credentials = new AWS.Credentials(
        KEY,
        SECRET,
        null)

    const s3 = new AWS.S3({credentials: credentials, signatureVersion: 'v4'})

    var getObjetPromise = s3.getObject({Bucket: bucket, Key: imageKey}).promise()
    
    return new Promise((resolve, reject) => {
    
        getObjetPromise.then(function(data){
            
            ResizeImage(new Buffer(data.Body, 'binary'), width).then(function(image){
                
                PutImage(newImageKey, bucket, image, s3)
                resolve("done")
            })
        })
    })

}