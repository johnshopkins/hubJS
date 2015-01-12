var expect = require("chai").expect;
var utils = require("../lib/utils");


describe("utils", function () {

  describe("extractEmbeddedItemIds", function () {

    it("should extract IDs properly", function () {

      var testData = {
        _embedded: {
          tags: [
            {id: 1},
            {id: 2},
            {id: 3},
            {id: 4},
            {id: 5}
          ]
        }
      };

      var expected = [1,2,3,4,5];
      var set = utils.extractEmbeddedItemIds(testData, "tags");
      expect(set).to.deep.equal(expected);

      var expected = [];
      var set = utils.extractEmbeddedItemIds({}, "tags");
      expect(set).to.deep.equal(expected);

      });

  });

  describe("extend", function () {

    it("should merge an object into an empty obejct", function () {

      var object = {
        fruit: ["banana", "strawberry", "plum"],
        veggies: ["green bean", "carrot"]
      };

      var combined = utils.extend({}, object);
      expect(combined).to.deep.equal(object);


    });

    it("should merge two objects", function () {

      var object = {
        fruit: ["banana", "strawberry", "plum"],
        veggies: ["green bean", "carrot"]
      };

      var object2 = {
        meat: ["chicken", "beef"]
      };

      var expected = {
        fruit: ["banana", "strawberry", "plum"],
        veggies: ["green bean", "carrot"],
        meat: ["chicken", "beef"]
      };

      var combined = utils.extend(object, object2);
      expect(combined).to.deep.equal(expected);


    });

    it("should merge two objects, giving preference to the second object", function () {

      var object = { fruit: ["banana", "strawberry", "plum"] };
      var object2 = { fruit: ["orange", "apple"] };

      var combined = utils.extend(object, object2);
      expect(combined).to.deep.equal(object2);


    });

    describe("isNumeric", function () {

      it("should return false when given a non-numeric string", function () {

        expect(utils.isNumeric("infinity")).to.equal(false);

      });

      it("should return true when given a numeric string", function () {

        expect(utils.isNumeric("15")).to.equal(true);

      });

      it("should return true when given a number", function () {

        expect(utils.isNumeric(15)).to.equal(true);

      });

    });

  });

});
