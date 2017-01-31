'use strict'

var _ = require('underscore');

/**
 * ## Json Diff
 * Function to check the diff between 2 json objects
 * 
 */
 function jsonDiff(){
  
  // Returns object class (date,array,regexp)
  var getClass = function(val) {
    return Object.prototype.toString.call(val)
      .match(/^\[object\s(.*)\]$/)[1];
  };

  //get descriptive data type
  var getType = function(val){
    //null is typeof object... but lets keep this simple
    if(val === undefined || val === null)
      return val
    
    if(typeof val === 'object'){
      return getClass(val).toLowerCase();
    }else{
      return typeof val;
    }
  }
  // check only if there any changes in values()
  var isEqual = {
    object : function(path,oldObj,newObj){
      var changes = [];
      var keys = Object.keys(oldObj)
      //check all updated and remove actions
      for (var i = keys.length - 1; i >= 0; i--) {
        var k = keys[i];
        var newPath=path+"."+k;
        var checkAttrDiff = diffObj(newPath,oldObj[k],newObj[k]);
        if(checkAttrDiff !== false){
          changes.push(checkAttrDiff)
        }
      }
      // check only new values on the right side
      var newKeys = _.difference(Object.keys(newObj),keys)
      for (var i = newKeys.length - 1; i >= 0; i--) {
        var k = newKeys[i];
        var newPath=path+"."+k;
        changes.push(output(newPath,undefined,newObj[k]))
      }
      return (!changes.length)?false:changes;
    },
    array : function(path,oldObj,newObj){
      var changes = [];
      // in case anything being added or removed will conside the all array as change
      if(oldObj.length !== newObj.length){
        return output(path,oldObj,newObj)
      }

      // simple position checking, in order to detect unorder, or push or pop
      for (var i = oldObj.length - 1; i >= 0; i--) {
        var newPath=path+"["+i+"]"
        var checkAttrDiff = diffObj(newPath,oldObj[i],newObj[i]);
        if(checkAttrDiff !== false){
          changes.push(checkAttrDiff)
        }
      }
      return (!changes.length)?false:changes;
    },
    date : function(path,oldObj,newObj){
      if(oldObj.getTime() === newObj.getTime()){
        return false
      }
      return output(path,x,y) 
    },
    regexp : function(path,oldObj,newObj){
      if(oldObj.toString() === newObj.toString()){
        return false;
      } 
      return output(path,oldObj,newObj)
    }
  }
  //output format
  var output = function(path,x,y){
    if(path[0] === '.'){
      path = path.substring(1);
    }
    return {"field":path,"old":x,"new":y}
  }
  // function to be called recursive to navigate throw objects
  var diffObj = function(path,x,y){
    var xType = getType(x);
    var yType = getType(y);

    if (xType === yType){
      //same type
      if (isEqual.hasOwnProperty(xType)){
        return isEqual[xType](path, x, y);
      } else if(x !== y){
        return output(path,x,y)
      } else {
        //in case it equals return false
        return false;
      }
    } else {
      //other type
      return output(path,x,y)
    }    
  }

  return {
    typeof : function(val){
      //only for test purposes
      return getType(val);
    },
    diff : function(oldObj,newObj,ignoreFields){
      /*deep nested diff function over json object
        data types handled:
          Primitive: undefined, null, Boolean,Number,String ( comparing by value)
          Non-Primitive : 
          object (deep comparasing),
          array(position comparsing,ignoring order),
          RegExp(converstion to string),
          Date (converstion to timestamp)
          Will ignore type function, since they dont represen data at all
        */
        if(getType(oldObj) !== 'object' && getType(newObj)!=='object'){
          throw new Error("please diff only valid json objects")
        }
        //strip object from fields to ignore ("ex:_timestamp")
        if(ignoreFields !== undefined){
          oldObj = _.omit(oldObj,ignoreFields)
          newObj = _.omit(newObj,ignoreFields)
        }
        return _.flatten(diffObj("",oldObj,newObj))
    }
  }
}
module.exports = jsonDiff