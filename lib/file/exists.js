var fs = require( 'fs' )
var File = require( './' )

module.exports =
function exists( callback ) {

  callback = callback != null ?
    callback.bind( this ) :
    callback

  return File.exists( this.path, callback )

}
