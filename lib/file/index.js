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
  
  options = options || {}
  
  this.path  = path
  this.fd    = options.fd
  this.flags = options.flags || 'r+'
  this.start = options.start || 0
  this.end   = options.end
  
  this.writes = new Queue( fs, 'write' )
  this.slices = []
  this.parent = options.parent
  
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
File.allocate =
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
 * Rename / move a given file
 * @param  {String}   from
 * @param  {String}   to
 * @param  {Function} callback (optional)
 */
File.move =
File.rename = function( from, to, callback ) {
  return ( typeof callback === 'function' ) ?
    fs.rename( from, to, callback ) :
    fs.renameSync( from, to )
}

/**
 * Delete / unlink a given file
 * @param  {String}   path
 * @param  {Function} callback (optional)
 */
File.unlink =
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
  
  __OOB: function( position, end ) {
    if( position < this.start )
      return true
    if( this.end != null )
      return position >= this.end
    if( end != null )
      return position >= end
  },
  
  allocate:    require( './truncate' ),
  close:       require( './close' ),
  create:      require( './create' ),
  delete:      require( './delete' ),
  exists:      require( './exists' ),
  move:        require( './rename' ),
  open:        require( './open' ),
  read:        require( './read' ),
  readStream:  require( './read-stream' ),
  rename:      require( './rename' ),
  slice:       require( './slice' ),
  stat:        require( './stat' ),
  truncate:    require( './truncate' ),
  unlink:      require( './delete' ),
  write:       require( './write' ),
  writeStream: require( './write-stream' ),
  
}
