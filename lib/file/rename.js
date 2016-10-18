var fs = require( 'fs' )
var File = require( './' )

module.exports = function rename( path, callback ) {

  var self = this

  if( typeof callback === 'function' ) {

    this.close( function( error ) {

      if( error != null )
        return callback.call( this, error )

      fs.rename( this.path, path, function( error ) {

        if( error != null )
          return callback.call( self, error )

        self.path = path
        self.open( callback )

      })

    })

  } else {

    this.close()
    this.renameSync( this.path, path )
    this.open()

  }

  return this

}
