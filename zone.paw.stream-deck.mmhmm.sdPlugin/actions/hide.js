const mmhmm = require( '../mmhmm' );

const STATE = Object.freeze({
  HIDING   : 0,
  SHOWING  : 1,
  DISABLED : 2
});

class StreamDeckActionHide {
  #streamDeck;
  #context;

  constructor ( streamDeck, context ) {
    this.#streamDeck = streamDeck;
    this.#context    = context;
  }

  updateState () {
    var self = this;
    mmhmm.hide().then( function ( hiding ) {
      if ( hiding !== undefined ) {
        self.#streamDeck.setState( self.#context, ( hiding ? STATE.HIDING : STATE.SHOWING ) );
      } else {
        self.#streamDeck.setState( self.#context, STATE.DISABLED );
      }
    });
  }

  disable () {
    this.#streamDeck.setState( this.#context, STATE.DISABLED );
  }

  onKeyUp () {
    var self = this;
    mmhmm.hide( true ).then( function ( hiding ) {
      if ( hiding !== undefined ) {
        self.#streamDeck.setState( self.#context, ( hiding ? STATE.HIDING : STATE.SHOWING ) );
      } else {
        self.#streamDeck.setState( self.#context, STATE.DISABLED );
        self.#streamDeck.showAlert( self.#context );
      }
    });
  }
}

module.exports = StreamDeckActionHide;
