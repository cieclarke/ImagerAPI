'use strict'

module.exports = (key) => {

    const match = key.match(/(.*)\/(.*)\/(.*)\.(.*)/)
    const size = match[3].toUpperCase()
    const folder = match[1]
    const originalKey = match[2] + "." + match[4]

    return {
        'size': size,
        'folder': folder,
        'originalKey': originalKey
    }
}