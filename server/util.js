'use strict';

const qs = require('querystring');
const request = require('request');

let util = {};

Function.prototype.promise = function () {
  //shift one out
  var args = Array.prototype.slice.call(arguments);
  var func = this;
  return new Promise(function (res, rej) {
    var cb = function () {
      var cb_args = Array.prototype.slice.call(arguments);
      var err = cb_args.shift();
      if (err) {
        return rej(err);
      } else {
        if (cb_args.length == 1) {
        	return res(cb_args[0]);
        } else {
        	return res(cb_args);
        }
      }
    };
    args.push(cb);
    func.apply(null, args);
  });
}

/**
 * GET请求
 * @param  {[type]}   url         [有参数时后缀必须以?结尾]
 * @param  {[type]}   queryParams [拼接在url后面的参数对]
 * @return {[type]}               [description]
 */
util.get = function (url, queryParams) {
	let _url = url + qs.stringify(queryParams);
	let options = {
	  method: 'GET',
	  url: _url
	};

  return request.promise(options)
}

/**
 * POST请求
 * @param  {[type]}   url         [有参数时后缀必须以?结尾]
 * @param  {[type]}   queryParams [拼接在url后面的参数对]
 * @param  {[type]}   data        [需要post的对象]
 * @return {[type]}               [description]
 */
util.post = function (url, queryParams, data) {
	let _url = url + qs.stringify(queryParams);
	let options = {
	  url: _url,
	  body: JSON.stringify(data)
	};

	request.post.promise(options);
}

module.exports = util;


