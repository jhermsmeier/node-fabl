var fs = require( 'fs' )
var File = require( './' )

module.exports =
function write( data, offset, callback ) {
  
  var self = this
  
  var buffer = Buffer.isBuffer( data ) ?
    data : new Buffer( data )
  
  if( typeof offset === 'function' ) {
    callback = offset
    offset = 0
  }
  
  if( typeof callback === 'function' ) {
    this.writeQueue.push(
      [ this.fd, buffer, 0, buffer.length, offset ],
      function( error, bytesWritten, buffer ) {
        if( error == null ) { self.offset += bytesWritten }
        callback.call( self, error, bytesWritten, buffer )
      }
    )
  } else {
    return fs.writeSync(
      this.fd, buffer, 0, buffer.length, offset
    )
  }
  
  return -1
  
}