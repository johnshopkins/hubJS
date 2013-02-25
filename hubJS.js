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
				// options: id, slug, topic, tag, issue, source, year
				return _library.get("articles", data, callbacks);
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

						var tags = payload._embedded.articles[0]._embedded.tags || [];
						var tagIds = tags.map(function(tag) {
							return tag.id;
						});

						var topics = payload._embedded.articles[0]._embedded.topics || [];
						var topicIds = topics.map(function(topic) {
							return topic.id;
						});

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