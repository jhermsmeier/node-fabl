var fs = require( 'fs' )
var File = require( './' )

module.exports =
function unlink( callback ) {
  
  callback = callback != null ?
    callback.bind( this ) :
    callback
  
  return File.delete( this.path, callback )
  
}
