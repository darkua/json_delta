"use strict"

var assert = require('assert');
var rfr = require('rfr');

describe('Diff',function() {
  
  var jsonDiff = rfr("/lib/json_diff.js")();

  var s1 = rfr("/test/simple_entry.json");
  var s2 = rfr("/test/simple_entry2.json");
  var s3 = rfr("/test/simple_entry3.json");
  var arrayEntry = rfr("/test/array_entry.json");
  
  
  it('should get correct primitive data type of value',function() {
    var data = [undefined, null, true,1,'string'];
    var expected = [undefined, null, 'boolean','number','string'];
    for (var i = data.length - 1; i >= 0; i--) {
      assert.equal(expected[i],jsonDiff.typeof(data[i]))
    }
  });

  it('should get correct non-primitive data type of value',function() {
    var data = [{}, [],new Date(),new RegExp('ab+c', 'i')];
    var expected = ['object','array','date','regexp'];
    for (var i = data.length - 1; i >= 0; i--) {
      assert.equal(expected[i],jsonDiff.typeof(data[i]))
    }
  });

  it('should get one value update',function() {
    var actual = jsonDiff.diff(s1,s2,["_id","_timestamp"])
    var expected = [{"field": "name", "old": "Bruce Norries", "new": "Chuck Willis"}]
    assert.equal(JSON.stringify(actual),JSON.stringify(expected))
  });

  it('should diff object update change',function() {
    var actual = jsonDiff.diff(s1,s3,["_id","_timestamp"])
    var expected = [{"field": "address.street", "old": "Some street", "new": "Some street i have no idea the name"}]
    assert.equal(JSON.stringify(actual),JSON.stringify(expected))
  });

  it('should diff array update changes',function() {
    var oldObj = {x:[1,2,3]};
    var newObj = {x:[3,2,1]};
    var actual = jsonDiff.diff(oldObj,newObj,["_id","_timestamp"]);
    var expected = [ { field: 'x[2]', old: 3, new: 1 },{ field: 'x[0]', old: 1, new: 3 } ];
    assert.equal(JSON.stringify(actual),JSON.stringify(expected))
  });

  it('should diff deleted value',function() {
    var oldObj = {x:[{y:1}]};
    var newObj = {x:[{}]};
    var actual = jsonDiff.diff(oldObj,newObj,["_id","_timestamp"]);
    var expected = [ { field: 'x[0].y', old: 1, new: undefined }];
    assert.equal(JSON.stringify(actual),JSON.stringify(expected))
  });

  it('should diff new value',function() {
    var oldObj = {x:{}};
    var newObj = {x:{y:1}};
    var actual = jsonDiff.diff(oldObj,newObj,["_id","_timestamp"]);
    var expected = [{ field: 'x.y', old: undefined, new: 1 }];
    assert.equal(JSON.stringify(actual),JSON.stringify(expected))
  });
  it('should return false when no changes',function() {
    var obj = {x:{}};
    var actual = jsonDiff.diff(obj,obj,["_id","_timestamp"]);
    var expected = false;
    assert.equal(actual,expected)
  });
});
