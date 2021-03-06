# FABL - File Abstraction Layer
[![npm](https://img.shields.io/npm/v/fabl.svg?style=flat-square)](https://npmjs.com/package/fabl)
[![npm](https://img.shields.io/npm/l/fabl.svg?style=flat-square)](https://npmjs.com/package/fabl)
[![npm downloads](https://img.shields.io/npm/dm/fabl.svg?style=flat-square)](https://npmjs.com/package/fabl)
[![build status](https://img.shields.io/travis/jhermsmeier/node-fabl.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-fabl)

## Install via [npm](https://npmjs.org)

```sh
$ npm install --save fabl
```

## Usage

Require it:
```js
var File = require( 'fabl' )
```

### Static methods on `File`

Creating a file:
```js
// Synchronous
var file = File.create( 'README.md' )
// Sync, with mode
var file = File.create( 'README.md', 0666 )
// Async, with mode and callback (mode is optional)
var file = File.create( 'README.md', 0666, function( error ) {
  // ...
})
```

Checking existance of a file:
```js
File.exists( 'schrödingers.cat' )
File.exists( 'schrödingers.cat', function( error, exists ) {
  // ...
})
```

Stat a file:
```js
File.stat( 'schrödingers.cat' )
File.stat( 'schrödingers.cat', function( error, stats ) {
  // ...
})
```

Renaming a file:
```js
// Rename and move are synonym
File.move( 'rain.txt', 'trash.txt' )
File.rename( 'junk.food', 'trash.txt', function( error ) {
  // ...
})
```

Truncating/Allocating a file:
```js
// Truncate and allocate are aliases,
// Size is optional, defaults to zero
File.truncate( 'trash.txt' )
File.allocate( 'random.mp3', 0x5000, function( error ) {
  // ...
})
```

Deleting a file:
```js
// Delete and unlink are aliases
File.delete( 'trash.txt' )
File.unlink( 'trash.txt', function( error ) {
  // ...
})
```

### Methods on an instance of `File`

Creating a file:
```js
// Create an instance with a given path
var file = new File( 'README.md' )
// Sync create
file.create() // OR
file.create( function( error ) {
  // ...
})
```

Opening a file:
```js
// Sync open, with defaults
// Flags default to 'r+', or previously used flags
// Mode defaults to whatever node defaults to (0666)
file.open() // OR
file.open( 'w' ) // OR
file.open( 'rs+', 0700 ) // OR
file.open( function( error, fd ) {
  // ...
})
```

Closing a file:
```js
file.close()
file.close( function( error ) {
  // ...
})
```

Deleting a file:
```js
file.delete() // OR
file.delete( function( error ) {
  // ...
})
```

Renaming/Moving a file:
```js
// Rename and Move are aliases
file.rename( 'READMORE.md' )
file.move( 'EVENMORE.md' )
file.rename( 'HAHAHA.md', function( error ) {
  // ...
})
```

Truncating/Allocating a file:
```js
// Truncate and Allocate are aliases as well
// Size is optional, defaults to zero
file.allocate( 265 * 1024 )
file.truncate( function( error ) {
  // ...
})
```

Stat'ing a file:
```js
var stat = file.stat()
file.stat( function( error, stats ) {
  // ...
})
```

Reading from a file:
```js
// Read a chunk synchronously
var data = file.read( offset, length )
// Offset can be omitted, and defaults to zero
file.read( 3000, function( error, bytesRead, data ) {
  // ...
})
// Create a readable stream
var stream = file.readStream()
// With boundaries
var bound = file.readStream( start, end )
// And / or with options
var optstream = file.readStream( start, {
  highWaterMark: 0x2000
})
```

Writing to a file:
```js
// Write data synchronously
var bytesWritten = file.write( 'NOOOOOOO!' )
// Add an offset (the length is determined by
// the bytelength of data (it's converted to a Buffer))
file.write( milk, 0xC0FFEE, function( error, bytesWritten, buffer ) {
  // ...
})
// Or create a writable stream, which has
// the same options as the readStream() above
var stream = file.writeStream()
```
