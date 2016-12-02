module.exports = function exists( callback ) {

  callback = callback != null ?
    callback.bind( this ) :
    callback

  return this.constructor.exists( this.path, callback )

}
