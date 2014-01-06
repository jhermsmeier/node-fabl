var fs = require( 'fs' )
var File = require( './' )

module.exports =
function stat( callback ) {
  return ( typeof callback === 'function' ) ?
    fs.fstat( this.fd, callback.bind( this ) ) :
    fs.fstatSync( this.fd )
}