var fs = require( 'fs' )
var File = require( './' )

module.exports =
function read( offset, length, callback ) {
  
  var self = this
  
  if( typeof length === 'function' ) {
    callback = length
    length = offset
    offset = 0
  }
  
  var buffer = new Buffer( length )
      buffer.fill( 0 )
  
  if( typeof callback === 'function' ) {
    this.stat( function( error, stat ) {
      
      if( error != null ) {
        return callback.call( this, error )
      }
      
      if( offset > stat.size - 1 ) {
        return callback.call( this, new Error(
          'Offset is out of bounds: ' +
            offset + ' / ' + ( stat.size - 1 )
        ))
      }
      
      fs.read(
        this.fd, buffer, 0, length, offset,
        function( error, bytesRead, buffer ) {
          if( error == null ) { self.offset += bytesRead }
          callback.call( self, error, bytesRead, buffer )
        }
      )
      
    })
  } else {
    
    var stat = this.stat()
    
    if( offset > stat.size - 1 ) {
      return callback.call( this, new Error(
        'Offset is out of bounds: ' +
          offset + ' / ' + ( stat.size - 1 )
      ))
    }
    
    return fs.readSync(
      this.fd, buffer, 0, length, offset
    )
    
  }
  
}