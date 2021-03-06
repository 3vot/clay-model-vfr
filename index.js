
var VFR= require("clay-vfr")

var Ajax = function(eventName, model, options){
  if(eventName == "create") return Ajax.post.call(this, model,options )
  else if(eventName == "update") return Ajax.put.call(this, model,options )
  else if(eventName == "destroy") return Ajax.del.call(this, model,options )
  
  //Sho
  var params = model;
  if(eventName == "query") return Ajax.query.call(this, params, options);  
  else if(eventName == "read") return Ajax.get.call(this, params, options);
  else if(eventName == "api") return Ajax.api.call(this, params, options);

}

Ajax.vfr = function(remoteAction, options){
  if(typeof remoteAction != "string" ) throw "First Argument should be the Remote Action (string)"
  if(!options) options = { escape: false  };
  

  var send = VFR( remoteAction, options, options.nullok || false );
  return send
}

Ajax.api = function(){
  if(!this.ajax.namespace && this.ajax.namespace != "") this.ajax.namespace = "threevot."
  var remoteAction = arguments[0];
  
  var callArgs = []
  for (var i = 1; i < arguments.length-1; i++) {
    callArgs.push(args[i]);
  };
  options = arguments[arguments.length-1];
  if(typeof remoteAction != "string" ) throw "First Argument should be the Remote Action (string)"
  if(options == remoteAction) options = {};

  var send = VFR( this.ajax.namespace + remoteAction, options, options.nullok || false );
  return send.apply( VFR, JSON.stringify(this.toJSON()) );
}

Ajax.query = function(params, options){
  if(!this.ajax.namespace && this.ajax.namespace != "") this.ajax.namespace = "threevot."

  var pctEncodeSpaces = true;
  var params = encodeURIComponent(params).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
  
  var send = VFR(this.ajax.namespace + ".handleRest" );
  return send( "get", "/query?query=" + params , "" )
  .then(function(results){ 
    for (var i = results.length - 1; i >= 0; i--) {
      results[i].id = results[i].Id
      delete results[i].Id;
    };
    return results;
   })
}

Ajax.get = function(id, options){
  if(!this.ajax.namespace && this.ajax.namespace != "") this.ajax.namespace = "threevot."

  var send = VFR(this.ajax.namespace + ".handleRest" );
  return send( "get", Ajax.generateURL(this) + "/" + id, "" )
  .then(function(data){
    data.id = data.Id;
    delete results[i].Id;
    return data;
  });
}

Ajax.post = function(model, options){
  if(!this.ajax.namespace && this.ajax.namespace != "") this.ajax.namespace = "threevot."
  var _this = this;


  var id = this.id;
  this.id = null;
  var send = VFR(model.ajax.namespace + ".handleRest" );
  return send( "post", Ajax.generateURL(model) , JSON.stringify(this.toJSON()) )
  .then( function(data){ _this.id = id; return data; } )
}

Ajax.put = function(model, options){
  if(!this.ajax.namespace && this.ajax.namespace != "") this.ajax.namespace = "threevot."

  var valuesToSend = JSON.parse(JSON.stringify(this.toJSON())); //ugly hack
  var previousAttributes = JSON.parse( model.previousAttributes[this.id] );
  for(key in valuesToSend){
    if(valuesToSend[key] == previousAttributes[key]){
      delete valuesToSend[key];
    }
  }

  var send = VFR(model.ajax.namespace + ".handleRest", {}, true );
  return send( "put", Ajax.generateURL(model, this.id ), JSON.stringify(valuesToSend) )
  .then( function(data){ return data; } )
}

Ajax.del = function(model, options){
  if(!this.ajax.namespace && this.ajax.namespace != "") this.ajax.namespace = "threevot."

  var send = VFR(model.ajax.namespace + ".handleRest", {}, true );
  return send( "del", Ajax.generateURL(model, this.id ), "" );
}

Ajax.generateURL = function() {
  var args, collection, object, path, scope;
  object = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  collection = object.className;
  
  args.unshift(collection);
  args.unshift(scope);
  path = args.join('/');
  path = path.replace(/(\/\/)/g, "/");
  path = path.replace(/^\/|\/$/g, "");
  return "/"+path;
};

module.exports = Ajax;

