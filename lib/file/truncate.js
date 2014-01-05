var fs = require( 'fs' )
var File = require( './' )

module.exports =
function truncate( size, callback ) {
  
  callback = callback != null ?
    callback.bind( this ) :
    callback
  
  return File.truncate(
    this.path, size, callback
  )
  
}
