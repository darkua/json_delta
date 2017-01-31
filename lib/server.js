'use strict'

var rfr = require("rfr")
var http = require("http")
var _ = require('underscore')
var HttpDispatcher = require("httpdispatcher")
var dispatcher = new HttpDispatcher()
var jsonDelta = rfr("/lib/json_delta")()
var jsonDiff = rfr("/lib/json_diff.js")()

//Lets define a port we want to listen to
var PORT=8080

//Endpoint handler for filter
dispatcher.onPost("/diff",function(req,res) {
  res.writeHead(200,{"Content-Type": "application/json"})
  try{
    //Diffs the data already filter by dates
    var diff = function(data){
      return _.mapObject(data, function(val) {
        //Validate enouph data
        if(val.length < 2){
          return "No data change in selected interval to diff changes"
        }
        
        var oldObj = val[0]
        var newObj = val[val.length-1]
        var changes = jsonDiff.diff(oldObj,newObj,["_id","_timestamp"])
        return (!changes)?"No changes":changes
      })
    }
    if(req.params.start === undefined && req.params.end === undefined){
      //Dont filter by time
      var data = jsonDelta.filter(req.params._id)
      var out = diff(data)
      res.end(JSON.stringify(out))
    } else if(
      isNaN(Date.parse(req.params.start)) ||
      isNaN(Date.parse(req.params.end))){
        var out = {"error":"dates value are not valid"}
        res.end(JSON.stringify(out))
    } else {
      //Filters the data relative to the selected query
      var data = jsonDelta.filter(
        req.params._id,
        Date.parse(req.params.start),
        Date.parse(req.params.end)
      );
      var out = diff(data)
      res.end(JSON.stringify(out))
    }
  } catch(err){
    res.end(err.toString())
  }
})

//Endpoint handler for add
dispatcher.onPost("/add",function(req,res) {
  res.writeHead(200,{"Content-Type": "text/plain"})
  if(!req.params.payload){
    res.end("Payload is missing!")
  }else{
    try{
      jsonDelta.add(JSON.parse(req.params.payload))
      res.end("OK")
    } catch(err){
      res.end(err.toString())
    }
  }
});

//Call req dispatcher
var httpHandler = function(req,res){
  return dispatcher.dispatch(req,res)
}

//Create a http server
http.createServer(httpHandler).listen(PORT,function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s",PORT)
})
