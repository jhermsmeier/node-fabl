var fs = require( 'fs' )
var File = require( './' )

module.exports =
function open( flags, mode, callback ) {
  
  var self = this
  
  if( arguments.length === 2 ) {
    callback = mode
    mode = void 0
  } else if( arguments.length === 1 ) {
    callback = flags
    flags = self.flags
  }
  
  if( typeof callback === 'function' ) {
    fs.open( this.path, flags, mode, function( error, fd ) {
      if( error == null ) {
        self.fd = fd
        self.flags = flags
      }
      callback.call( self, error, fd )
    })
  } else {
    this.fd = fs.openSync( this.path, flags, mode )
    this.flags = flags
  }
  
  return this
  
}
