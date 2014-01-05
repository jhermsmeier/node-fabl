var fs = require( 'fs' )
var File = require( './' )

module.exports =
function stat( callback ) {
  
  callback = callback != null ?
    callback.bind( this ) :
    callback
  
  return File.stat( this.path, callback )
  
}