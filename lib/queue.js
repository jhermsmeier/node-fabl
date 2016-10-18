var Queue = require( 'double-ended-queue' )
var fs = require( 'fs' )

function CallQueue( context, method ) {

  if( !(this instanceof CallQueue) )
    return new CallQueue( context, method )

  this.context = context
  this.method = method

  this.args = new Queue()
  this.callbacks = new Queue()

  this.running = false

}

// Exports
module.exports = CallQueue

CallQueue.prototype = {

  constructor: CallQueue,

  run: function() {

    if( this.running || !this.callbacks.length )
      return void 0

    var self = this
    var argv = this.args.shift()
    var callback = this.callbacks.shift()

    argv.push( function() {
      callback.apply( this, arguments )
      self.running = false
      self.run()
    })

    this.context[ this.method ]
      .apply( this.context, argv )

    return this.running = true

  },

  push: function( argv, callback ) {
    this.args.push( argv )
    this.callbacks.push( callback )
    this.run()
  }

}
