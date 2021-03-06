/**
 *  Copyright 2013 Ionică Bizău
 *
 *  A Node.JS module, which provides an object oriented wrapper for the Youtube v3 API.
 *  Author: Ionică Bizău <bizauionica@gmail.com>
 *
 **/

"use strict";
var Request = require("request");
var Api     = require("./api/v3.0.0/index");
var _       = require("underscore");
var fetch   = require('fetch');

var Client = module.exports = function(config) {
};

(function() {
    var config  = {};
    var proxy   = {};
    /**
     *  Client#authenticate(options) -> null
     *      - options (Object): Object containing the access token
     *          - token (String): OAuth2 token
     *
     *  Set an authentication method to have access to protected resources.
     *
     *  Example
     *
     *      Youtube.authenticate({
     *          token: "..."
     *      });
     **/
    this.authenticate = function (options) {
        if (!options) {
            config.auth = undefined;
            return;
        }

        // TODO Does Youtube API support basic auth?
        options.type = options.type || "oauth";

        if (!options.type || "basic|oauth|key".indexOf(options.type) === -1) {
            throw new Error("Invalid authentication type must be 'oauth' or 'key'");
        } else if (options.type == "key" && !options.key) {
            throw new Error("Key authentication requires a key to be set");
        } else if (options.type == "oauth" && !options.token) {
            throw new Error("OAuth2 authentication requires a token to be set");
        }

        config.auth = options;
    };

    /**
     *  Client#getConfig() -> config
     *
     *  Returns Client configuration object
     **/
    this.getConfig = function () {
        return config;
    };

    /**
     *  Client#setConfig(config) -> config
     *
     *  Sets the Client configuration object.
     **/
    this.setConfig = function (conf) {
        return config = conf;
    };

    this.setProxy = function(conf)
    {
        return proxy = conf;
    };
    
    this.getProxy = function(conf)
    {
        return proxy;
    };
    /**
     *  Client#request(options, callback) -> null
     *      - options (Object): parameters to send as the request body
     *      - callback (Function): function to be called when the request returns.
     *          If the the request returns with an error, the error is passed to
     *          the callback as its first argument (NodeJS-style).
     *
     *  Send an HTTP request to the server and pass the result to a callback.
     **/
    this.request = function(options, callback) {

        var reqOptions = {
            gzip: true
        };

        if (typeof options === "string") {
            reqOptions.url = options;
        }

        for (var option in options) {
            reqOptions[option] = options[option];
        }

        if (reqOptions.json == undefined) {
            reqOptions.json = true;
        }

        var proxyObj    = this.getProxy()
        var defaults    = {
            headers: {
                'Accept-Encoding'   : 'gzip',
                'User-Agent'        : 'gzip'
            }
        };

        var url = reqOptions.url;
        var _options = {};
        _options.headers = {};
        if(proxyObj.host)
        {
            var auth = '';
            if( proxyObj.user && proxyObj.pass )
            {
                //auth = (proxyObj.user +':'+ proxyObj.pass) + '@';
                _options.headers['proxy-authorization'] = 'Basic ' + new Buffer(proxyObj.user + ':' + proxyObj.pass).toString('base64');
            }
            //defaults.proxy = 'http://' + auth + proxyObj.host;
            _options.hostname  = proxyObj.host;
            if( proxyObj.port )
            {
                //defaults.proxy += (':' + proxyObj.port);
                _options.port      = proxyObj.port;
            }
        }

        _options.rejectUnauthorized = false;
        _options.headers['pragma'] = 'no-cache';
        _options.headers['cache-control']= 'max-age=0, no-cache, no-store, must-revalidate';
        _options.headers['Accept-Encoding'] = 'gzip';
        _options.headers['User-Agent'] = 'gzip';
        
        fetch.fetchUrl(url, _options, function (err, res, body) {
          
            if (!err && res.status == 200) {
                body = body.toString();
                return callback(null, body);
            }

            if (err) {
                return callback(err);
            }
            if (body && body.error) {            
                err = body.error.message || body.error;
            }

            // unknown error
            callback("Something wrong happened in the request (index.js:this.request) function. Check the logs for more information.");
            console.error(
                 "\n---- Submit an issue with the following information ----" +
                 "\nIssues: https://github.com/IonicaBizau/youtube-api/issues" +
                 "\nParams: "       + JSON.stringify(reqOptions) +
                 "\nDate: "         + new Date().toString() +
                 "\nError: "        + JSON.stringify(err) +
                 "\nStatus Code:: " + JSON.stringify(res.statusCode) +
                 "\nBody: "         + JSON.stringify(body) +
                 "\n------------------"
            );
        });
    };
}).call(Client);
Api.call(Client);
