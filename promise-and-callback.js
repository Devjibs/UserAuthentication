'use strict'

const fs = require('fs')  
const path = require('path')  
const packagePath = path.resolve(__dirname, '..', 'package.json')

function packageInfo (callback) {  
    callback = callback || function () {}

    return new Promise((resolve, reject) => {
        Fs.readFile(packagePath, (err, data) => {
        if (err) {
            // if no callback available, reject the promise
            // else, return callback using "error-first-pattern"
            return callback ? callback(err) : reject(err)
        }

        return callback ? callback(null, data) : resolve(data)
        })
    })
}

module.exports = packageInfo