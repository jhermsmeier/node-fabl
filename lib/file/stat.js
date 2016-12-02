module.exports = function stat( callback ) {
  return ( typeof callback === 'function' ) ?
    this.fs.fstat( this.fd, callback.bind( this ) ) :
    this.fs.fstatSync( this.fd )
}
