var fs = require( 'fs' )
var File = require( './' )

module.exports = function create( mode, callback ) {

  if( typeof mode === 'function' ) {
    callback = mode
    mode = void 0
  }

  if( typeof callback === 'function' ) {
    this.open( 'w', mode, function( error, fd ) {
      if( error ) {
        callback.call( this, error )
      } else {
        this.fd = fd
        this.close( function( error ) {
          callback.call( this, error )
        })
      }
    })
  } else {
    this.open( 'w', mode )
    this.close()
  }

  return this

}
