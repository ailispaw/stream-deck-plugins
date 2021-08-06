const mmhmm = require( '../mmhmm' );

const STATE = Object.freeze({
  NO_SLIDE : 0,
  ENABLED  : 1,
  DISABLED : 2
});

class StreamDeckActionNext {
  #streamDeck;
  #context;

  constructor ( streamDeck, context ) {
    this.#streamDeck = streamDeck;
    this.#context    = context;
  }

  setState ( state, settings ) {
    if ( state !== undefined ) {
      this.#streamDeck.setState( this.#context, ( state ? STATE.ENABLED : STATE.NO_SLIDE ) );
    } else {
      this.disable();
    }
  }

  updateState ( settings ) {
    var self = this;
    mmhmm.next().then(( state ) => {
      self.setState( state, settings );
    });
  }

  disable () {
    this.#streamDeck.setState( this.#context, STATE.DISABLED );
  }

  onKeyUp ( settings ) {
    var self = this;
    mmhmm.next( true ).then(( state ) => {
      self.setState( state, settings );
      if ( state === undefined ) {
        self.#streamDeck.showAlert( self.#context );
      }
    });
  }
}

module.exports = StreamDeckActionNext;
