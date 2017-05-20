'use strict'

module.exports = (eventData) => {

    const records = eventData.Records
    
    if(records && records.length > 0) {
        
        const record = records[0]

        return {
            Bucket: record.s3.bucket.name,
            Image: record.s3.object.key,
            GalleryName: 'galleryName'
        }

    }

    return { }
    
}