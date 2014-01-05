var fs = require( 'fs' )
var Queue = require( '../queue' )

/**
 * File Constructor
 * @param {String} path
 * @param {Object} options
 */
function File( path, options ) {
  
  if( !(this instanceof File) )
    return new File( path, options )
  
  if( typeof path !== 'string' ) {
    throw new TypeError(
      'File path must be of type String'
    )
  }
  
  this.path = path
  this.fd = null
  this.flags = 'r+'
  
  this.writeQueue = new Queue( fs, 'write' )
  
}

// Exports
module.exports = File

/**
 * Create a new file
 * @param  {String}   path
 * @param  {Number}   mode
 * @param  {Function} callback (optional)
 * @return {File}
 */
File.create = function( path, mode, callback ) {
  return new File( path )
    .create( mode, callback )
}

/**
 * Test if a given path exists on the FS
 * @param  {String}   path
 * @param  {Function} callback (optional)
 * @return {Boolean|Undefined}
 */
File.exists = function( path, callback ) {
  return ( typeof callback === 'function' ) ?
    fs.exists( path, callback ) :
    fs.existsSync( path )
}

/**
 * Stat a given path
 * @param  {String}   path
 * @param  {Function} callback (optional)
 * @return {Boolean|Undefined}
 */
File.stat = function( path, callback ) {
  return ( typeof callback === 'function' ) ?
    fs.stat( path, callback ) :
    fs.statSync( path )
}

/**
 * Truncate a file to a given size
 * @param  {String}   path
 * @param  {Number}   size
 * @param  {Function} callback (optional)
 */
File.truncate = function( path, size, callback ) {
  
  if( typeof size !== 'number' ) {
    callback = size
    size = 0
  }
  
  return ( typeof callback === 'function' ) ?
    fs.truncate( path, size, callback ) :
    fs.truncateSync( path, size )
  
}

/**
 * Delete / unlink a given file
 * @param  {String}   path
 * @param  {Function} callback (optional)
 */
File.delete = function( path, callback ) {
  return ( typeof callback === 'function' ) ?
    fs.unlink( path, callback ) :
    fs.unlinkSync( path )
}

/**
 * File Prototype
 * @type {Object}
 */
File.prototype = {
  
  constructor: File,
  
  exists:      require( './exists' ),
  stat:        require( './stat' ),
  seek:        require( './seek' ),
  allocate:    require( './truncate' ),
  create:      require( './create' ),
  open:        require( './open' ),
  readStream:  require( './read-stream' ),
  writeStream: require( './write-stream' ),
  read:        require( './read' ),
  write:       require( './write' ),
  truncate:    require( './truncate' ),
  close:       require( './close' ),
  delete:      require( './delete' ),
  
}
