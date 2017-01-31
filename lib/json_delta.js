'use strict'

var _ = require('underscore');

/**
 * ## Json Delta handlers
 * Handlers for the json delta service
 *
 */
 function jsonDelta() {

  var list = {}

  //Add item to list
  var addItem = function(item) {
    var id = item._id

    if (typeof item !== "object")
      throw new Error('item is not an object')

    if (id === undefined)
      throw new Error('_id is not present')

    if (!list[id]) {
      list[id] = []
    }
    if (!item._timestamp) {
      item._timestamp = Date.now()
    }

    list[id].push(item)
    return true
  }
  
  //Add an Array of items to list
  var addItemArray = function(itemArray) {
    for (var i = 0; i < itemArray.length; i++) {
      addItem(itemArray[i])
    }
    return true
  }
  //Filter elements based on id, and timestamp
  var filterByDates = function(elements, startDate, endDate) {
    if(!startDate || !endDate){
      return elements
    }else{
      return _.filter(elements, function(item) {
        return item._timestamp >= startDate && item._timestamp < endDate
      })  
    }
  }
    return {
    /**
     * ## add
     * Add data
     */
     add: function(data) {
      return (!data.length) ? addItem(data) : addItemArray(data)
    },
    /**
     * ## get
     * get data for a specific id
     */
     get: function(id) {
      return list[id]
    },
    /**
     * ## list
     * lists all data registered
     */
     getList: function() {
      return list
    },
    /**
     * ## clean
     * Cleans all entries from list
     */
     clean: function() {
      list = {}
      return true
    },
    /**
     * ## total
     * Total elements in the list
     */
     total: function() {
      return Object.keys(list).length
    },
    /**
     * ## filter
     * Filter data from list according to id and timestamp
     */
     filter: function(_id, startDate, endDate) {
      var elements;
      if (_id === undefined) {
        return _.mapObject(list, function(val, key) {
          return filterByDates(val, startDate, endDate)
        });
      } else {
        var out = {}
        out[_id]=filterByDates(list[_id], startDate, endDate)
        return out;
      }
    }
  }
}

module.exports = jsonDelta