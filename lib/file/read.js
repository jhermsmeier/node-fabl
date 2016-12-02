module.exports = function read( offset, length, callback ) {

  var self = this

  if( typeof length === 'function' ) {
    callback = length
    length = offset
    offset = 0
  }

  var buffer = null

  if( typeof callback === 'function' ) {
    this.stat( function( error, stat ) {

      if( error != null ) {
        return callback.call( this, error )
      }

      if( this.__OOB( offset, stat.size - 1 ) ) {
        return callback.call( this, new Error(
          'Offset out of bounds'
        ))
      }

      length = Math.min( length, stat.size - 1 - offset )
      length = Math.min( length, this.end || Infinity )
      length = Math.max( length, 0 )

      buffer = new Buffer( length )
      buffer.fill( 0 )

      self.fs.read(
        this.fd, buffer, 0, length, offset,
        function( error, bytesRead, buffer ) {
          callback.call( self, error, bytesRead, buffer )
        }
      )

    })
  } else {

    var stat = this.stat()

    if( this.__OOB( offset, stat.size - 1 ) ) {
      throw new Error( 'Offset out of bounds' )
    }

    length = Math.min( length, stat.size - 1 - offset )
    length = Math.min( length, this.end || Infinity )
    length = Math.max( length, 0 )

    buffer = new Buffer( length )
    buffer.fill( 0 )

    this.fs.readSync( this.fd, buffer, 0, length, offset )

  }

  return buffer

}
