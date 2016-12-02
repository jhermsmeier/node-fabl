module.exports = function unlink( callback ) {

  if( typeof callback === 'function' ) {
    this.close( function( error ) {
      if( error ) return callback( error )
      File.delete( this.path, callback.bind( this ) )
    })
  } else {
    this.close()
    this.constructor.delete( this.path )
  }

  return this

}
