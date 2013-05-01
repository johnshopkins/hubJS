var hubJS = (function (ajax) {

	/**
	 * Hub library object for reference inside
	 * return object.
	 */
	var _library;

	/**
	 * Default settings
	 * @type {Object}
	 */
	var _defaultSettings = {
		version: 0
	};


	return {

		/**
		 * User defined settings
		 * @type {Object}
		 */
		userSettings: {},

		/**
		 * API base URL
		 * @type {String}
		 */
		baseUrl: "http://api.hub.jhu.edu/",

		/**
		 * Initialize the Hub library.
		 * 
		 * @param  {object} settings
		 * @return null
		 */
		init: function (settings) {
			_library = this;
			_library.userSettings = _library.utility.extend({}, _defaultSettings, settings);
		},

		/**
		 * Gets a payload from the Hub API
		 * 
		 * @param  {string} 	endpoint  	API endpoint
		 * @param  {object} 	data     	Data to be sent to the server
		 * @return {jqXHR}    				See: http://api.jquery.com/jQuery.ajax/#jqXHR
		 */
		get: function(endpoint, data) {

			var data = _library.utility.extend({}, data);
			data.v = _library.userSettings.version;

			if (data.id) {
				endpoint = endpoint + "/" + data.id;
				delete data.id;
			}

	        return ajax.get({
	            url: _library.baseUrl + endpoint,
	            dataType: "jsonp",
	            data: data
	        });
	    },

	    /**
	     * Articles methods
	     * @type {Object}
	     */
		articles: {

			/**
			 * Find an article or articles
			 * 
			 * @param  {object} 	data     	Data to be sent to the server
			 * @return {jqXHR}    				See: http://api.jquery.com/jQuery.ajax/#jqXHR
			 */
			find: function(data) {
				var data = _library.utility.extend({}, data);
				return _library.get("articles", data);
			},

			/**
			 * Convenience method to find recent articles
			 * 
			 * @param  {integer} 	count	 	Number of articles to retrieve
			 * @return {jqXHR}    				See: http://api.jquery.com/jQuery.ajax/#jqXHR
			 */
			recent: function(count) {
				var data = { per_page: _library.utility.isNumeric(count) ? count : 5 };
				return _library.articles.find(data);
			},

			/**
			 * Find popular articles
			 * 
			 * @param  {object} 	data     	Data to be sent to the server
			 * @return {jqXHR}    				See: http://api.jquery.com/jQuery.ajax/#jqXHR
			 */
			popular: function(data) {
				var data = _library.utility.extend({}, data, { order_by: "score", score: "trending" });
				return _library.get("articles", data);
			},

			/**
			 * Find articles related to a specific article
			 * 
			 * @param  {integer} 	id        	ID of article to lookup other articles against
			 * @param  {object} 	data     	Data to be sent to the server
			 * @return {deferred}    			See: http://api.jquery.com/category/deferred-object/
			 */
			related: function(id, data) {

				// if the user passed additional related IDs, merge them with ours
				var ids = data && data.excluded_ids ? id + "," + data.excluded_ids : id;

				var data = _library.utility.extend({}, data, { excluded_ids: ids });

				var toReturn;
				
				var article = _library.articles.find({id: id});

				var relatedByTags = article.then(function (payload) {
					var tagIds = _library.utility.extractEmbeddedItemIds(payload, "tags");
					var tagData = _library.utility.extend({}, data, { tags: tagIds.join(",") });
					return _library.articles.find(tagData);
				});

				var relatedByTopics = article.then(function (payload) {
					var topicIds = _library.utility.extractEmbeddedItemIds(payload, "topics");
					var topicData = _library.utility.extend({}, data, { topics: topicIds.join(",") });
					return relatedByTopics = _library.articles.find(topicData);
				});

				relatedByTags.done(function (payload) {
					toReturn = (payload._embedded.articles) ? "tags" : "topics";
				});

				return (toReturn == "tags") ? relatedByTags.done(callback) : relatedByTopics.done(callback);
			}
		},

		/**
	     * Utility methods
	     * @type {Object}
	     */
		utility: {

			/**
			 * Extract the IDs of all items in a given
			 * embedded object; for example tags or topics.
			 * 
			 * @param  {object} payload Payload to extract embedded item IDs from
			 * @param  {string} object  Target object (like "tags")
			 * @return {array}        	IDs
			 */
			extractEmbeddedItemIds: function(payload, object) {
				var target = (payload && payload._embedded && payload._embedded[object]) || [];
				return target.map(function (value, i) {
					return value.id
 				});
			},
			/**
			 * Mimics jQuery.extend()
			 * @return new object
			 */
			extend: function() {
				for (var i = 1, len = arguments.length; i < len; i++) {
					for (var key in arguments[i]) {
						if (arguments[i].hasOwnProperty(key)) {
							arguments[0][key] = arguments[i][key];
						}
					}
				}
				return arguments[0];
			},
			isNumeric: function(obj) {
				return !isNaN( parseFloat(obj) ) && isFinite( obj );
			}
		}
	}

})(simplyAjax);