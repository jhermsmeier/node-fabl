var fs = require( 'fs' )
var File = require( './' )

module.exports =
function seek( offset, callback ) {
  
  offset = parseInt( offset, 10 )
  
  if( typeof callback === 'function' ) {
    this.stat( function( error, stat ) {
      
      if( error != null ) {
        return callback.call( this, error )
      }
      
      offset = offset < 0 ?
        stat.size + offset - 1 :
        offset
      
      if( offset > stat.size - 1 ) {
        return callback.call( this, new Error(
          'Offset is out of bounds: ' +
            offset + ' / ' + ( stat.size - 1 )
        ))
      }
      
    })
  } else {
    
    var stat = this.stat()
    
    offset = offset < 0 ?
      stat.size + offset - 1 :
      offset
    
    if( offset > stat.size - 1 ) {
      throw new Error(
        'Offset is out of bounds: ' +
          offset + ' / ' + ( stat.size - 1 )
      )
    }
    
  }
  
  return this
  
}
