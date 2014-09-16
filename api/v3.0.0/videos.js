/**
 *  Copyright 2013 Ionică Bizău
 *
 *  A Node.JS module, which provides an object oriented wrapper for the Youtube v3 API.
 *  Author: Ionică Bizău <bizauionica@gmail.com>
 *
 **/

var Util = require("../../util");

function getRating (options, callback) {
    var self = this;

    var url = Util.createUrl.apply(self, ["videos/getRating", options]);
    var reqOptions = {
        url: url,
    };

    self.Client.request(reqOptions, callback);
}

function list (options, callback) {
    var self = this;

    var url = Util.createUrl.apply(self, ["videos", options]);
    var reqOptions = {
        url: url,
    };

    self.Client.request(reqOptions, callback);
}

function comments (options, callback) {
    var self = this;

    var reqOptions = {
        url: 'https://gdata.youtube.com/feeds/api/videos/'+options.videoId+'/comments?alt=json',
    };

    self.Client.request(reqOptions, callback);
}

function insert (options, callback) {
    callback(null, {"error": "Not yet implemented"});
}

function update (options, callback) {
    callback(null, {"error": "Not yet implemented"});
}
function deleteItem (options, callback) {
    callback(null, {"error": "Not yet implemented"});
}
function rate (options, callback) {
    callback(null, {"error": "Not yet implemented"});
}

function getData (options, callback) {
    var self = this;

    var reqOptions = {
        url: 'https://gdata.youtube.com/feeds/api/users/'+options.userId+'?alt=json'
    };

    self.Client.request(reqOptions, callback);
}

module.exports = {
    getRating: getRating,
    list: list,
    comments: comments,
    insert: insert,
    update: update,
    delete: deleteItem,
    rate: rate,
    getData: getData
};