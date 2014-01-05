var fs = require( 'fs' )
var Queue = require( './queue' )

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
  
  this.writeQueue = new Queue( fs, 'write' )
  
}

// Exports
module.exports = File

File.create = function( path, mode, callback ) {
  return new File( path )
    .create( mode, callback )
}

File.exists = function( path, callback ) {
  return ( typeof callback === 'function' ) ?
    fs.exists( path, callback ) :
    fs.existsSync( path )
}

File.stat = function( path, callback ) {
  return ( typeof callback === 'function' ) ?
    fs.stat( path, callback ) :
    fs.statSync( path )
}

File.truncate = function( path, size, callback ) {
  
  if( typeof size !== 'number' ) {
    callback = size
    size = 0
  }
  
  return ( typeof callback === 'function' ) ?
    fs.truncate( path, size, callback ) :
    fs.truncateSync( path, size )
  
}

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
  
  exists: function( callback ) {
    
    callback = callback != null ?
      callback.bind( this ) :
      callback
    
    return File.exists( this.path, callback )
    
  },
  
  stat: function( callback ) {
    
    callback = callback != null ?
      callback.bind( this ) :
      callback
    
    return File.stat( this.path, callback )
    
  },
  
  seek: function( offset, callback ) {
    
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
    
  },
  
  allocate: function( size, callback ) {
    return this.truncate( size, callback )
  },
  
  create: function( mode, callback ) {
    
    if( typeof mode === 'function' ) {
      callback = mode
      mode = void 0
    }
    
    if( typeof callback === 'function' ) {
      this.open( 'w', mode, function( error, fd ) {
        if( error ) {
          callback.call( this, error )
        } else {
          this.fd = fd
          this.close( function( error ) {
            callback.call( this, error )
          })
        }
      })
    } else {
      this.open( 'w', mode )
      this.close()
    }
    
    return this
    
  },
  
  open: function( flags, mode, callback ) {
    
    var self = this
    
    if( arguments.length === 2 ) {
      callback = mode
      mode = void 0
    } else if( arguments.length === 1 ) {
      callback = flags
      flags = 'r+'
    }
    
    if( typeof callback === 'function' ) {
      fs.open( this.path, flags, mode, function( error, fd ) {
        if( !error ) { self.fd = fd }
        callback.call( self, error, fd )
      })
    } else {
      this.fd = fs.openSync( this.path, flags, mode )
    }
    
    return this
    
  },
  
  readStream: function( start, end, options ) {
    
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
    
    return fs.createReadStream( this.path, options )
    
  },
  
  writeStream: function( start, end, options ) {
    
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
    
    return fs.createWriteStream( this.path, options )
    
  },
  
  read: function( offset, length, callback ) {
    
    var self = this
    
    if( typeof length === 'function' ) {
      callback = length
      length = offset
      offset = 0
    }
    
    var buffer = new Buffer( length )
        buffer.fill( 0 )
    
    if( typeof callback === 'function' ) {
      this.stat( function( error, stat ) {
        
        if( error != null ) {
          return callback.call( this, error )
        }
        
        if( offset > stat.size - 1 ) {
          return callback.call( this, new Error(
            'Offset is out of bounds: ' +
              offset + ' / ' + ( stat.size - 1 )
          ))
        }
        
        fs.read(
          this.fd, buffer, 0, length, offset,
          function( error, bytesRead, buffer ) {
            if( error == null ) { self.offset += bytesRead }
            callback.call( self, error, bytesRead, buffer )
          }
        )
        
      })
    } else {
      
      var stat = this.stat()
      
      if( offset > stat.size - 1 ) {
        return callback.call( this, new Error(
          'Offset is out of bounds: ' +
            offset + ' / ' + ( stat.size - 1 )
        ))
      }
      
      return fs.readSync(
        this.fd, buffer, 0, length, offset
      )
      
    }
    
  },
  
  write: function( data, offset, callback ) {
    
    var self = this
    
    var buffer = Buffer.isBuffer( data ) ?
      data : new Buffer( data )
    
    if( typeof offset === 'function' ) {
      callback = offset
      offset = 0
    }
    
    if( typeof callback === 'function' ) {
      this.writeQueue.push(
        [ this.fd, buffer, 0, buffer.length, offset ],
        function( error, bytesWritten, buffer ) {
          if( error == null ) { self.offset += bytesWritten }
          callback.call( self, error, bytesWritten, buffer )
        }
      )
    } else {
      return fs.writeSync(
        this.fd, buffer, 0, buffer.length, offset
      )
    }
    
    return -1
    
  },
  
  truncate: function( size, callback ) {
    
    callback = callback != null ?
      callback.bind( this ) :
      callback
    
    return File.truncate(
      this.path, size, callback
    )
    
  },
  
  close: function( callback ) {
    
    var self = this
    
    if( typeof callback === 'function' ) {
      if( this.fd == null ) {
        callback.call( self )
      } else {
        fs.close( this.fd, function( error ) {
          if( !error ) { self.fd = null }
          callback.call( self, error )
        })
      }
    } else if( this.fd == null ) {
      fs.close( this.fd )
      this.fd = null
    }
    
    return this
    
  },
  
  delete: function( callback ) {
    
    callback = callback != null ?
      callback.bind( this ) :
      callback
    
    return File.delete( this.path, callback )
    
  }
  
}
