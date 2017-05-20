'use strict'

module.exports = (imageName, nameOption) => {

    var regex = /(.*\/)(.*)(\..*)$/
    var result = imageName.match(regex);
    var location = result[1]
    var fileName = result[2]
    var fileExt = result[3]

    return location + fileName + "/" + nameOption + fileExt

}