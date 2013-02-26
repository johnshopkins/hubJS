var hub = (function (global, $) {

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
		 * @param  {string} endpoint  	API endpoint
		 * @param  {object} data     	Data to be sent to the server
		 * @param  {object} callbacks 	Success and error callback definitions
		 * @return {jqXHR}    			See: http://api.jquery.com/jQuery.ajax/#jqXHR
		 */
		get: function(endpoint, data, callbacks) {

			data.v = _library.userSettings.version;

	        return $.ajax({
	            url: "http://api.hub.jhu.edu/" + endpoint,
	            dataType: "jsonP",
	            data: data,
	            success: callbacks && callbacks.success,
	            error: callbacks && callbacks.error
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
			 * @param  {object} data     	Data to be sent to the server
			 * @param  {object} callbacks 	Success and error callback definitions
			 * @return {jqXHR}    			See: http://api.jquery.com/jQuery.ajax/#jqXHR
			 */
			find: function(data, callbacks) {
				var endpoint = data.id ? "articles/" + data.id : "articles";
				return _library.get(endpoint, data, callbacks);
			},

			/**
			 * Find recent articles
			 * 
			 * @param  {object} data     	Data to be sent to the server
			 * @param  {object} callbacks 	Success and error callback definitions
			 * @return {jqXHR}    			See: http://api.jquery.com/jQuery.ajax/#jqXHR
			 */
			recent: function(data, callbacks) {
				return _library.articles.find(data, callbacks);
			},

			/**
			 * Find popular articles
			 * 
			 * @param  {object} data     	Data to be sent to the server
			 * @param  {object} callbacks 	Success and error callback definitions
			 * @return {jqXHR}    			See: http://api.jquery.com/jQuery.ajax/#jqXHR
			 */
			popular: function(data, callbacks) {
				data = $.extend({}, data, { order_by: "score", score: "trending" });
				return _library.get("articles", data, callbacks);
			},

			/**
			 * Find articles related to a specific article
			 * 
			 * @param  {[integer]} 	id        	ID of article to lookup other articles against
			 * @param  {object} 	callbacks 	Success and error callback definitions
			 * @return {jqXHR}    				See: http://api.jquery.com/jQuery.ajax/#jqXHR
			 */
			related: function(id, callbacks) {

				var checkPayload = function(payload, callback) {
					if (payload._embedded.articles) {
						callbacks.success(payload);
						return;
					}
				};

				_library.articles.find({id: id}, {
					success: function (payload) {

						var tagIds = _library.utility.extractEmbeddedItemIds(payload, "tags");
						var topicIds = _library.utility.extractEmbeddedItemIds(payload, "topics");

						// Tag relations
						_library.articles.find({tags: tagIds.join(","), excluded_ids: id}, {
							success: function (payload) {
								checkPayload(payload);

								// Topic relations
								_library.articles.find({topics: topicIds.join(","), excluded_ids: id}, {
									success: function (payload) {
										checkPayload(payload);
									}
								});
							}
						});
					}
				});
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