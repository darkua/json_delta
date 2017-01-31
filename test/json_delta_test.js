"use strict"

var assert = require('assert');
var rfr = require('rfr');

describe('Add',function() {
  
  var jsonDelta = rfr("/lib/json_delta.js")();

  var simpleEntry = rfr("/test/simple_entry.json");
  var arrayEntry = rfr("/test/array_entry.json");
  
  beforeEach(function() {
    jsonDelta.clean();
  });

  it('should add a model to list',function() {
    assert.equal(true,jsonDelta.add(simpleEntry));
    var actual = jsonDelta.get(simpleEntry._id)[0];
    var expected = simpleEntry;
    assert.equal(actual,expected);
  });

  it('should add an array of models to the list',function() {
    assert.equal(true,jsonDelta.add(arrayEntry));
    var first = arrayEntry[0];
    var actual = jsonDelta.get(first._id);
    var expected = arrayEntry;
    assert.equal(actual.length,expected.length);
  });

  it('should add timestamp to data',function() {
    assert.equal(true,jsonDelta.add(simpleEntry),Error);
    assert.notEqual(undefined,jsonDelta.get(simpleEntry._id).pop()._timestamp)
    
  });

  it('should fail if no id present in user model',function() {
    assert.throws(function(){jsonDelta.add({"name":"bla"});},Error);
  });

  it('should fail if data is not a valid json object',function() {
    assert.throws(function(){jsonDelta.add("bla");},Error);
  });

  it('should filter data to specified id, no start/end Date',function() {
    assert.equal(true,jsonDelta.add(arrayEntry));
    var _id = arrayEntry[0]._id;
    var actual = jsonDelta.filter(_id);
    assert.equal(arrayEntry.length,actual[_id].length);
  });

  it('should filter data to all entries with no start/end Date interval',function() {
    assert.equal(true,jsonDelta.add(arrayEntry));
    var _id = arrayEntry[0]._id;
    var actual = jsonDelta.filter();
    assert.equal(arrayEntry.length,actual[_id].length);
  });

  it('should filter data to specified id, with start/end Date',function() {
    //interval for only one entrie in the array_entry.json
    var starDate = 1483228800000
    var endDate = 1483315100000
    assert.equal(true,jsonDelta.add(arrayEntry));    
    var _id = arrayEntry[0]._id;
    var actual = jsonDelta.filter(_id,starDate,endDate);
    assert.equal(1,actual[_id].length);
  });

  it('should filter data to all entries with start/end Date interval',function() {
    //interval for only two entries in the array_entry.json
    var starDate = 1483228800000
    var endDate = 1483315300000
    assert.equal(true,jsonDelta.add(arrayEntry));
    var _id = arrayEntry[0]._id;
    var actual = jsonDelta.filter(undefined,starDate,endDate);
    assert.equal(2,actual[_id].length);
  });
  it('should return [] to filter with outbound start/end Date interval',function() {
    //interval for only two entries in the array_entry.json
    var starDate = 1485831355254
    var endDate = 1485831355254
    assert.equal(true,jsonDelta.add(arrayEntry));
    var _id = arrayEntry[0]._id;
    var actual = jsonDelta.filter(undefined,starDate,endDate);
    assert.equal(0,actual[_id].length);
  });
});
