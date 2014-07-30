var utils = function () {

};

/**
 * Extract the IDs of all items in a given
 * embedded object; for example tags or topics.
 * 
 * @param  {object} payload Payload to extract embedded item IDs from
 * @param  {string} object  Target object (like "tags")
 * @return {array}          IDs
 */
utils.prototype.extractEmbeddedItemIds = function(payload, object) {
  var target = (payload && payload._embedded && payload._embedded[object]) || [];
  var ids = [];

  var length = target.length;
  for (var i = 0; i < length; i++) {
    ids.push(target[i].id);
  }

  return ids;
};

/**
 * Mimics jQuery.extend()
 * @return new object
 */
utils.prototype.extend = function() {
  for (var i = 1, len = arguments.length; i < len; i++) {
    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key)) {
        arguments[0][key] = arguments[i][key];
      }
    }
  }
  return arguments[0];
};

utils.prototype.isNumeric = function(obj) {
  return !isNaN( parseFloat(obj) ) && isFinite( obj );
};

module.exports = new utils();
