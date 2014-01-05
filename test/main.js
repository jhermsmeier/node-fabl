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
  })
  
  it( 'should be able to write to an OOB offset', function( done ) {
    tmp.write( '\0', 127, done )
  })
  
  it( 'should NOT be able to seek to OOB offset', function() {
    assert.throws( function() {
      tmp.seek( 255 )
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
  
  it( 'should be able to read from an OOB offset', function( done ) {
    tmp.read( 256, 10, done )
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
