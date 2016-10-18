var fs = require( 'fs' )
var File = require( './' )

module.exports = function readStream( start, end, options ) {

  if( arguments.length === 1 && typeof start === 'object' ) {
    options = start
    start = void 0
  } else if( arguments.length === 2 && typeof end === 'object' ) {
    options = end
    end = void 0
  }

  options = options || {}

  options.start = options.start != null ?
    options.start : start

  options.end = options.end != null ?
    options.end : end

  if( this.start != null ) {
    options.start = options.start != null ?
      Math.max( options.start, this.start ) :
      this.start
  }

  if( this.end != null ) {
    options.end = options.end != null ?
      Math.min( options.end, this.end ) :
      this.end
  }

  // For whatever reasons, the 'end' parameter
  // of a stream is inclusive, so we make it exclusive here
  options.end = options.end != null ?
    options.end - 1 : options.end

  return fs.createReadStream( this.path, options )

}
