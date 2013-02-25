var hubster = (function (global, $) {

    var _settings = {
    	success: function (payload, status, jqXHR) {
    		console.log("global success callback");
    		return payload;
    	},
    	error: function (jqXHR, status, error) {
    		console.log("global error callback");
    		return status + " " + error;
    	}
    }
	
	function get(endpoint, data, settings) {

		// default objects
	    var data = data || {};
	    var settings = settings || {};

	    // Add API version to data object
	    data.v = 1;

	    // Setup callbacks for this call
	    callbacks = {
	    	success: settings.success || _settings.success,
	    	error: settings.error || _settings.error
	    };

        return $.ajax({
            url: "http://api.hub.jhu.edu/" + endpoint,
            dataType: "jsonP",
            data: data,
            success: function (payload, status, jqXHR) {
            	callbacks.success(payload, status, jqXHR);
            },
            error: function (jqXHR, status, error) {
            	callbacks.error(jqXHR, status, error);
            }
        });
    }
	
	return {

		// Alter global settings
		setSettings: {
			success: function(callback) {
				_settings.success = callback;
			},
			error: function(callback) {
				_settings.error = callback;
			}
		},

		getArticles: {

			// id based
			
			byId: function (id, settings) {
				var endpoint = "articles/" + id;
				return get(endpoint, {}, settings);
			},

			relatedTo: function (id) {

			},


			// recent
			
			recent: function() {

			},

			recentInTag: function (tag) {

			},

			recentInTopic: function (topic) {

			},


			// popular
			
			popular: function() {

			},

			popularInTag: function (tag) {

			},

			popularInTopic: function (topic) {

			},

		},

		galleries: {

		},

		issues: {

		}

	}

})(window, jQuery);