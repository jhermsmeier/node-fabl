var Stream = require( 'stream' )
var fs = require( 'fs' )
var Path = require( 'path' )

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
  this.offset = 0
  
}

// Exports
module.exports = File

File.create = function( path, callback ) {
  return new File( path ).create( callback )
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

File.truncate = function( path, length, callback ) {
  
  if( typeof length !== 'number' ) {
    callback = length
    length = 0
  }
  
  return ( typeof callback === 'function' ) ?
    fs.truncate( path, length, callback ) :
    fs.truncateSync( path, length )
  
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
        
        this.offset = offset
        
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
      
      this.offset = offset
      
    }
    
    return this
    
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
  
  read: function( offset, length, callback ) {
    
    var self = this
    
    if( typeof length === 'function' ) {
      callback = length
      length = offset
      offset = this.offset
    }
    
    // Cast NaN -> 0
    length = length != length ?
      0 : length
    
    var buffer = new Buffer( length )
        buffer.fill( 0 )
    
    if( typeof callback === 'function' ) {
      fs.read(
        this.fd, buffer, 0, length, offset,
        function( error, bytesRead, buffer ) {
          if( error == null ) { self.offset += bytesRead }
          callback.call( self, error, bytesRead, buffer )
        }
      )
    } else {
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
      offset = this.offset
    }
    
    if( typeof callback === 'function' ) {
      fs.write(
        this.fd, buffer, 0, buffer.length, offset,
        function( error, bytesWritten, buffer ) {
          if( error == null ) { self.offset += bytesWritten }
          callback.call( self, error, bytesWritten, buffer )
        }
      )
    } else {
      var bytesWritten = fs.writeSync(
        this.fd, buffer, 0, buffer.length, offset
      )
      this.offset += bytesWritten
      return bytesWritten
    }
    
    return -1
    
  },
  
  truncate: function( callback ) {
    
    if( typeof callback === 'function' ) {
      this.close( function( error ) {
        this.open( 'w+', callback )
      })
    } else {
      this.close()
      this.open( 'w+' )
    }
    
    return this
    
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
