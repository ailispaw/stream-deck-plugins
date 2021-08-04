const mmhmm = require( '../mmhmm' );

const STATE = Object.freeze({
  OFF_AIR  : 0,
  ON_AIR   : 1,
  DISABLED : 2
});

class StreamDeckActionAway {
  #streamDeck;
  #context;

  constructor ( streamDeck, context ) {
    this.#streamDeck = streamDeck;
    this.#context    = context;
  }

  updateState ( settings ) {
    var self = this;
    mmhmm.away().then( function ( away ) {
      if ( away !== undefined ) {
        self.#streamDeck.setState( self.#context, ( away ? STATE.OFF_AIR : STATE.ON_AIR ) );
      } else {
        self.#streamDeck.setState( self.#context, STATE.DISABLED );
      }
    });
  }

  disable () {
    this.#streamDeck.setState( this.#context, STATE.DISABLED );
  }

  onKeyUp ( settings ) {
    var self = this;
    mmhmm.away( true ).then( function ( away ) {
      if ( away !== undefined ) {
        self.#streamDeck.setState( self.#context, ( away ? STATE.OFF_AIR : STATE.ON_AIR ) );
      } else {
        self.#streamDeck.setState( self.#context, STATE.DISABLED );
        self.#streamDeck.showAlert( self.#context );
      }
    });
  }
}

module.exports = StreamDeckActionAway;
