var fs = require( 'fs' )
var File = require( './' )

module.exports = function truncate( size, callback ) {

  if( typeof size !== 'number' ) {
    callback = size
    size = 0
  }

  callback = callback != null ?
    callback.bind( this ) :
    callback

  typeof callback === 'function' ?
    fs.ftruncate( this.fd, size, callback ) :
    fs.ftruncateSync( this.fd, size )

  return this

}
