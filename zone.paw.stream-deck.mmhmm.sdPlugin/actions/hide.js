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

  setState ( state, settings ) {
    if ( state !== undefined ) {
      this.#streamDeck.setState( this.#context, ( state ? STATE.HIDING : STATE.SHOWING ) );
    } else {
      this.disable();
    }
  }

  updateState ( settings ) {
    var self = this;
    mmhmm.hide().then(( state ) => {
      self.setState( state, settings );
    });
  }

  disable () {
    this.#streamDeck.setState( this.#context, STATE.DISABLED );
  }

  onKeyUp ( settings ) {
    var self = this;
    mmhmm.hide( true ).then(( state ) => {
      self.setState( state, settings );
      if ( state === undefined ) {
        self.#streamDeck.showAlert( self.#context );
      }
    });
  }
}

module.exports = StreamDeckActionHide;
