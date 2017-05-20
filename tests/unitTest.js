'use strict'

const assert = require('assert')
const rename = require('./../rename')

describe('image renaming structure', () => {
    it('rename on gallery', () => {
        assert.equal('Gallery_Name/IMG0945/small.jpg', rename('Gallery_Name/IMG0945.jpg', 'small'))
    })
    it('rename on sub gallery', () => {
        assert.equal('Gallery_Name/Sub_Gallery/IMG0945/medium.jpg', rename('Gallery_Name/Sub_Gallery/IMG0945.jpg', 'medium'))
    })
})