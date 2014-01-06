var fs = require( 'fs' )
var File = require( './' )

module.exports =
function writeStream( start, end, options ) {
  
  if( arguments.length === 1 && typeof start === 'object' ) {
    options = start
    start = void 0
  } else if( arguments.length === 2 && typeof end === 'object' ) {
    options = end
    end = void 0
  }
  
  options = options || {}
  options.flags = options.flags || 'r+'
  
  options.start = options.start != null ?
    options.start : start
  
  options.end = options.end != null ?
    options.end : end
  
  return fs.createWriteStream( this.path, options )
  
}
