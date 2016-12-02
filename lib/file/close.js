module.exports = function close( callback ) {

  var self = this

  if( typeof callback === 'function' ) {
    if( this.fd == null ) {
      callback.call( self )
    } else {
      this.fs.close( this.fd, function( error ) {
        if( !error ) { self.fd = null }
        callback.call( self, error )
      })
    }
  } else if( this.fd == null ) {
    this.fs.close( this.fd )
    this.fd = null
  }

  return this

}
