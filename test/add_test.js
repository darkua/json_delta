
var assert = require('assert');
var rfr = require('rfr')

describe('Add', function() {
  
  var jsonDelta = rfr("/lib/json_delta.js")()

  var simpleEntry = rfr("/test/simple_entry.json")
  var arrayEntry = rfr("/test/array_entry.json")
  
  beforeEach(function() {
    jsonDelta.clean()
  });

  it('should add a model to list', function() {
    assert.equal(true, jsonDelta.add(simpleEntry))
    let list = jsonDelta.list()
    assert.equal(1, jsonDelta.total())
  });

  it('should add an array of models to the list', function() {
    assert.equal(true, jsonDelta.add(arrayEntry));
    let list = jsonDelta.list()
    assert.equal(1, jsonDelta.total())
  });

  it('should fail if no id present in user model', function() {
    assert.throws(()=>{jsonDelta.add({"name":"bla"})},Error);
  });

  it('should fail if data is not a valid json object', function() {
    assert.throws(()=>{jsonDelta.add("bla")},Error);
  });

});