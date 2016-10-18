var fs = require( 'fs' )
var File = require( './' )

module.exports =
function slice( start, end, create ) {

  var stat = this.stat()
  var max = stat.size - 1

  if( typeof start !== 'number' ) {
    throw new TypeError( 'First argument must be a number' )
  }

  if( start > end || start >= max ) {
    throw new Error( 'Start offset is out of bounds' )
  }

  var slice = new File( this.path, {
    fd: !create && this.fd,
    parent: !create && this,
    start: start,
    end: end,
  })

  if( !create ) {
    this.slices.push( slice )
  } else {
    slice.open()
  }

  return slice

}
