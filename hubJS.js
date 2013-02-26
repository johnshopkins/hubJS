var hub = (function (global, $) {

	var _library;

	/**
	 * User defined settings
	 * @type {Object}
	 */
	var _settings = {};

	/**
	 * Default settings
	 * @type {Object}
	 */
	var _defaultSettings = {
		version: 0
	};

	/**
	 * Extract the IDs of all items in a given
	 * embedded object; for example tags or topics.
	 * 
	 * @param  {object} payload Payload to extract embedded item IDs from
	 * @param  {string} object   [description]
	 * @return {array}        	IDs
	 */
	function extractEmbeddedItemIds(payload, object) {
		var target = payload._embedded[object];
		return target.map(function(object) {
			return object.id;
		});
	}
	
	
	return {

		init: function (settings) {
			_settings = $.extend(_defaultSettings, settings);
			_library = this;
		},

		get: function(endpoint, data, callbacks) {

			data.v = _settings.version;

	        return $.ajax({
	            url: "http://api.hub.jhu.edu/" + endpoint,
	            dataType: "jsonP",
	            data: data,
	            success: callbacks && callbacks.success,
	            error: callbacks && callbacks.error
	        });
	    },

		articles: {

			find: function(data, callbacks) {
				var endpoint = data.id ? "articles/" + data.id : "articles";
				return _library.get(endpoint, data, callbacks);
			},

			recent: function(data, callbacks) {
				return _library.articles.find(data, callbacks);
			},

			popular: function(data, callbacks) {

				// Add order_by and score to data object with precedence
				data = $.extend({}, data, { order_by: "score", score: "trending" });

				return _library.get("articles", data, callbacks);
			},

			related: function(id, callbacks) {
				_library.articles.find({id: id}, {
					success: function (payload) {

						var tagIds = extractEmbeddedItemIds(payload, "tags");
						var topicIds = extractEmbeddedItemIds(payload, "topics");

						// First try to get articles related by tag
						_library.articles.find({tags: tagIds.join(","), excluded_ids: id}, {
							success: function (payload) {
								if (payload._embedded.articles) {
									callbacks.success(payload);
									return;
								}

								// If no articles related by tag, try topics
								_library.articles.find({topics: topicIds.join(","), excluded_ids: id}, {
									success: function (payload) {
										if (payload._embedded.articles) {
											callbacks.success(payload);
											return;
										}
									}
								});
							}
						});
					}
				});
			}
		}
	}

})(window, jQuery);