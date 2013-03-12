var hubJS = (function (global, $) {

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
		version: 0,
		error: function() {
			console.log("An error of the fatal kind has occured.");
		}
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
			_library.userSettings = $.extend({}, _defaultSettings, settings);
		},

		/**
		 * Gets a payload from the Hub API
		 * 
		 * @param  {string} 	endpoint  	API endpoint
		 * @param  {object} 	data     	Data to be sent to the server
		 * @param  {function} 	callback 	Function to run when request is successful
		 * @return {jqXHR}    				See: http://api.jquery.com/jQuery.ajax/#jqXHR
		 */
		get: function(endpoint, data, callback) {

			var data = $.extend({}, data);
			data.v = _library.userSettings.version;

			if (data.id) {
				endpoint = endpoint + "/" + data.id;
				delete data.id;
			}

	        return $.ajax({
	            url: _library.baseUrl + endpoint,
	            dataType: "jsonP",
	            data: data,
	            success: callback,
	            error: _library.userSettings.error
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
			 * @param  {function} 	callback 	Function to run when request is successful
			 * @return {jqXHR}    				See: http://api.jquery.com/jQuery.ajax/#jqXHR
			 */
			find: function(data, callback) {
				var data = $.extend({}, data);
				return _library.get("articles", data, callback);
			},

			/**
			 * Find recent articles
			 * 
			 * @param  {object} 	data     	Data to be sent to the server
			 * @param  {function} 	callback 	Function to run when request is successful
			 * @return {jqXHR}    				See: http://api.jquery.com/jQuery.ajax/#jqXHR
			 */
			recent: function(data, callback) {
				var data = $.extend({}, data);
				return _library.articles.find(data, callback);
			},

			/**
			 * Find popular articles
			 * 
			 * @param  {object} 	data     	Data to be sent to the server
			 * @param  {function} 	callback 	Function to run when request is successful
			 * @return {jqXHR}    				See: http://api.jquery.com/jQuery.ajax/#jqXHR
			 */
			popular: function(data, callback) {
				var data = $.extend({}, data, { order_by: "score", score: "trending" });
				return _library.get("articles", data, callback);
			},

			/**
			 * Find articles related to a specific article
			 * 
			 * @param  {integer} 	id        	ID of article to lookup other articles against
			 * @param  {function} 	callback 	Function to run when request is successful
			 * @return {deferred}    			See: http://api.jquery.com/category/deferred-object/
			 */
			related: function(id, callback) {
				var toReturn;

				var article = _library.articles.find({id: id});

				var relatedByTags = article.then(function (data) {
						var tagIds = _library.utility.extractEmbeddedItemIds(data, "tags");					
						return _library.articles.find({tags: tagIds.join(","), excluded_ids: id});
					}
				);

				var relatedByTopics = article.then(function (data) {
						var topicIds = _library.utility.extractEmbeddedItemIds(data, "topics");
						return relatedByTopics = _library.articles.find({topics: topicIds.join(","), excluded_ids: id});
					}
				);

				relatedByTags.done(function (data) {
					toReturn = (data._embedded.articles) ? "tags" : "topics";
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
				return target.map(function(object) {
					return object.id;
				});
			}
		}
	}

})(window, jQuery);