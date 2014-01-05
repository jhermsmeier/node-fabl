var assert = require( 'assert' )
var File = require( '../' )

const TEMP = __dirname + '/file.tmp'

describe( 'File', function() {
  
  var tmp = null
  
  it( 'should be able to create a new file', function( done ) {
    File.create( TEMP, done )
  })
  
  it( 'should be able to open a file', function( done ) {
    tmp = new File( TEMP )
      .open( done )
  })
  
  it( 'should be able to write to an opened file', function( done ) {
    tmp.write( 'HELLO WORLD\0', done )
    tmp.write( 'HELLO WORLD\0' )
  })
  
  it( 'should be able to write to an OOB offset', function( done ) {
    tmp.write( '\0', 127, done )
    tmp.write( '\0', 127 )
  })
  
  it( 'should NOT be able to seek to OOB offset', function() {
    assert.throws( function() {
      tmp.seek( 256 * 1024 )
    })
  })
  
  it( 'should be able to seek to with negative offset', function() {
    assert.doesNotThrow( function() {
      tmp.seek( -1 )
    })
  })
  
  it( 'should be able to read from an opened file', function( done ) {
    var data = 'HELLO WORLD\0'
    tmp.read( 0, data.length, function( error, bytesRead, buffer ) {
      assert.equal( bytesRead, data.length )
      assert.equal( buffer.toString(), data )
      done( error )
    })
  })
  
  it( 'should NOT be able to read from an OOB offset', function( done ) {
    tmp.read( 256, 10, function( error, read, buffer ) {
      assert.ok( error )
      done()
    })
    assert.throws( function() {
      tmp.read( 256, 10 )
    })
  })
  
  it( 'should be able to create a writeStream of file', function( done ) {
    var data = '11111 11111\0'
    var ws = tmp.writeStream()
    tmp.offset = 0
    ws.write( data, function() {
      done()
    })
  })
  
  it( 'should be able to create a readStream of file', function( done ) {
    var data = '11111 11111\0'
    var rs = tmp.readStream()
    rs.on( 'readable', function() {
      var bytes = rs.read()
      assert.ok( bytes.toString().indexOf( data ) === 0 )
      done()
    })
  })
  
  it( 'should be able to allocate to a file', function() {
    var size = 256 * 1024
    tmp.truncate( size )
    var stat = tmp.stat()
    assert.equal( stat.size, size )
  })
  
  it( 'should be able to truncate a file', function() {
    var size = 256
    tmp.truncate( size )
    var stat = tmp.stat()
    assert.equal( stat.size, size )
  })
  
  it( 'should be able to close an opened file', function( done ) {
    tmp.close( function( error ) {
      tmp = null
      done( error )
    })
  })
  
  it( 'should be able to delete a file', function( done ) {
    File.delete( TEMP, done )
  })
  
})
