"use strict"

var assert = require('assert');
var rfr = require('rfr');

describe('Diff',function() {
  
  var jsonDelta = rfr("/lib/json_delta.js")();

  var simpleEntry = rfr("/test/simple_entry.json");
  var simpleEntry2 = rfr("/test/simple_entry2.json");
  var arrayEntry = rfr("/test/array_entry.json");
  
  beforeEach(function() {
    jsonDelta.clean();
  });
  
  it('should diff one value change',function() {
    // assert.equal(true,jsonDelta.add(simpleEntry));
    // assert.equal(true,jsonDelta.add(simpleEntry2));
    // var actual = jsonDelta.filter(simpleEntry._id)
    // var expected = {"field": "name", "old": "Bruce Norries", "new": "Chuck Willis"}
    // assert.equal(actual,expected)
  });

  it('should diff one nested object change',function() {
    
  });

  it('should diff one array change',function() {
    
  });

  it('should diff changes in specified time interval',function() {
    
  });

});
