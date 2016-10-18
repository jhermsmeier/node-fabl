var fs = require( 'fs' )
var File = require( './' )

module.exports = function write( data, offset, callback ) {

  var self = this

  var buffer = Buffer.isBuffer( data ) ?
    data : new Buffer( data )

  if( typeof offset === 'function' ) {
    callback = offset
    offset = 0
  }

  if( typeof callback === 'function' ) {

    if( this.__OOB( offset ) )
      return callback.call( this, new Error( 'Offset out of bounds' ) )

    if( this.__OOB( offset + buffer.length ) )
      return callback.call( this, new Error( 'Length out of bounds' ) )

    this.writes.push(
      [ this.fd, buffer, 0, buffer.length, offset ],
      function( error, bytesWritten, buffer ) {
        callback.call( self, error, bytesWritten, buffer )
      }
    )

  } else {

    if( this.__OOB( offset ) )
      throw new Error( 'Offset out of bounds' )

    if( this.__OOB( offset + buffer.length ) )
      throw new Error( 'Length out of bounds' )

    return fs.writeSync(
      this.fd, buffer, 0, buffer.length, offset
    )

  }

  return -1

}
