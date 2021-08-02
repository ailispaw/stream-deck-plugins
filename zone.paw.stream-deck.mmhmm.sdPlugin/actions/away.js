const mmhmm = require( '../mmhmm' );

const STATE = Object.freeze({
  OFF_AIR  : 0,
  ON_AIR   : 1,
  DISABLED : 2
});

class StreamDeckActionAway {
  #streamDeck;
  #context;

  #timer    = null;
  #interval = 1000;

  #destructed = false;

  constructor ( streamDeck, context ) {
    this.#streamDeck = streamDeck;
    this.#context    = context;

    var self = this;
    this.#timer = setTimeout( function () {
      self.updateState();
    }, this.#interval );
  }

  destructor () {
    if ( this.#timer ) {
      clearTimeout( this.#timer );
      this.#timer = null;
    }
    this.#destructed = true;
  }

  updateState () {
    if ( this.#timer ) {
      clearTimeout( this.#timer );
      this.#timer = null;
    }
    if ( this.#destructed ) {
      return;
    }
    var self = this;
    mmhmm.away().then( function ( away ) {
      if ( away !== undefined ) {
        self.#streamDeck.setState( self.#context, ( away ? STATE.OFF_AIR : STATE.ON_AIR ) );
      } else {
        self.#streamDeck.setState( self.#context, STATE.DISABLED );
      }
      self.#timer = setTimeout( function () {
        self.updateState();
      }, self.#interval );
    });
  }

  disable () {
    this.#streamDeck.setState( this.#context, STATE.DISABLED );
  }

  onKeyUp () {
    var self = this;
    mmhmm.away( true ).then( function ( away ) {
      if ( away !== undefined ) {
        self.#streamDeck.setState( self.#context, ( away ? STATE.OFF_AIR : STATE.ON_AIR ) );
      } else {
        self.#streamDeck.setState( self.#context, STATE.DISABLED );
      }
    });
  }
}

module.exports = StreamDeckActionAway;
