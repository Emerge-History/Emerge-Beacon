'use strict';

const rp = require('request-promise');
let util = {};

util.groupPost = (url, data, accessToken) => {
    let options = {
        method: 'POST',
        uri: url,
        qs: {
            access_token: accessToken
        },
        body: data,
        json: true
    };
    return rp(options);
}

module.exports = util;
