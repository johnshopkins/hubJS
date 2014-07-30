var ajax = require("./lib/simplyAjax");
var Deferred = require("./lib/deferred");
var utils = require("./lib/utils");


/**
 * Default settings
 * @type {Object}
 */
var _defaultSettings = {
  version: 0,
  key: null
};

/**
 * API base URL
 * @type {String}
 */
var baseUrl = "http://api.hub.jhu.edu/";
var userSettings = {};



var hubJS = function (settings) {
  userSettings = utils.extend({}, _defaultSettings, settings);
};

/**
 * Gets a payload from the Hub API
 * 
 * @param  {string}   endpoint    API endpoint
 * @param  {object}   data      Data to be sent to the server
 * @return {Object}     promise
 */
hubJS.prototype.get = function (endpoint, data) {
  data = utils.extend({}, data);
  data.v = userSettings.version;
  data.key = userSettings.key;

  if (data.id) {
    endpoint = endpoint + "/" + data.id;
    delete data.id;
  }

  return ajax.get({
    url: baseUrl + endpoint,
    dataType: "jsonp",
    data: data
  });
}

/**
 * Articles methods
 * @type {Object}
 */
hubJS.prototype.articles = {

  /**
   * Find an article or articles
   * 
   * @param  {object}   data      Data to be sent to the server
   * @return {Object}     promise
   */
  find: function(data) {
    data = utils.extend({}, data);
    return hubJS.prototype.get("articles", data);
  },

  /**
   * Convenience method to find recent articles
   * 
   * @param  {integer}  count   Number of articles to retrieve
   * @return {Object}     promise
   */
  recent: function(count) {
    var data = { per_page: utils.isNumeric(count) ? count : 5 };
    return this.find(data);
  },

  /**
   * Find popular articles
   * 
   * @param  {object}   data      Data to be sent to the server
   * @return {Object}     promise
   */
  popular: function(data) {
    data = utils.extend({}, data, { order_by: "score", score: "trending" });
    return hubJS.prototype.get("articles", data);
  },

  /**
   * Find articles related to a specific article
   * 
   * @param  {integer}  id          ID of article to lookup other articles against
   * @param  {object}   data      Data to be sent to the server
   * @return {Object}     promise
   */
  related: function(id, data) {

    var deferred = new Deferred();

    // if the user passed additional related IDs, merge them with ours
    var ids = data && data.excluded_ids ? id + "," + data.excluded_ids : id;

    data = utils.extend({}, data, { excluded_ids: ids });

    // get the article data
    var article = this.find({id: id});
    var articlePayload;
    
    // find articles with the same tags
    var relatedByTag = article.then(function (payload) {
      articlePayload = payload;
      var tagIds = utils.extractEmbeddedItemIds(articlePayload, "tags");
      var tagData = utils.extend({}, data, { tags: tagIds.join(",") });
      return this.find(tagData);

    }).then(function (payload) {

      // if there are articles in the payload, return them and continue in down the pipe
      if (payload._embedded.articles) {
        return payload;

      // if there are not articles, get articles related by topic
      } else {
        var topicIds = utils.extractEmbeddedItemIds(articlePayload, "topics");
        var topicData = utils.extend({}, data, { topics: topicIds.join(",") });
        return this.find(topicData);
      }

    // send the payload back
    }).then(function (payload) {
      deferred.resolve(payload);
    });

    return deferred.promise;
  }
  
};

/**
 * Events methods
 * @type {Object}
 */
hubJS.prototype.events = {

  /**
   * Find an event or events
   * 
   * @param  {object}   data      Data to be sent to the server
   * @return {Object}     promise
   */
  find: function(data) {
    data = utils.extend({}, data);
    return hubJS.prototype.get("events", data);
  },

  /**
   * Convenience method to find recent events
   * 
   * @param  {integer}  count   Number of events to retrieve
   * @return {Object}     promise
   */
  upcoming: function(count) {
    var data = { per_page: utils.isNumeric(count) ? count : 5 };
    return this.find(data);
  }

};

module.exports = hubJS;
