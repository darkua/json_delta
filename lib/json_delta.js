(function () { //eslint-disable-line wrap-iife

  'use strict';

  /**
     * ## Json Delta handlers
     * Handlers for the json delta service
     *
     */
  function jsonDelta() {

    var list = {};

    var addItem= function (item) {
      var id = item._id
      
      if(typeof item !== "object" )
        throw new Error('item is not a valid json object');

      if(id === undefined)
        throw new Error('_id is not present');

      if (!list[id]){
        list[id] = []
      }
      list[id].push(item)
      return true
    };

    var addItemArray= function (itemArray) {
      for (var i = itemArray.length - 1; i >= 0; i--) {
        addItem(itemArray[i])
      }
      return true
    };

    return {
      /**
         * ## add
         * Add data
         */
      add: function (data) {
        return (!data.length)?addItem(data):addItemArray(data);
      },
      /**
         * ## get
         * get data for a specific id
         */
      get : function(id){
        return list[id];
      },
      /**
         * ## list
         * lists all data registered
         */
      list : function(){
        return list;
      },/**
         * ## clean
         * Cleans all entries from list
         */
      clean : function(){
        list = {};
        return true;
      },/**
         * ## total
         * Total elements in the list
         */
      total : function(){
        return Object.keys(list).length
      }
    };
  }

  module.exports = jsonDelta;
})();
