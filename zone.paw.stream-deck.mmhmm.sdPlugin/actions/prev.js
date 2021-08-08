const mmhmm = require( '../mmhmm' );

const STATE = Object.freeze({
  NO_SLIDE : 0,
  ENABLED  : 1,
  DISABLED : 2
});

class StreamDeckActionPrev {
  #streamDeck;
  #context;
  #state;

  constructor ( streamDeck, context ) {
    this.#streamDeck = streamDeck;
    this.#context    = context;
  }

  setState ( state, settings ) {
    if ( state !== undefined ) {
      if ( this.#state === state ) {
        return;
      }
      this.#state = state;
      this.#streamDeck.setState( this.#context, ( state ? STATE.ENABLED : STATE.NO_SLIDE ) );
    } else {
      this.disable();
    }
  }

  updateState ( settings ) {
    var self = this;
    mmhmm.prev().then(( state ) => {
      self.setState( state, settings );
    });
  }

  disable () {
    if ( this.#state === undefined ) {
      return;
    }
    this.#state = undefined;
    this.#streamDeck.setState( this.#context, STATE.DISABLED );
  }

  onKeyUp ( settings ) {
    var self = this;
    mmhmm.prev( true ).then(( state ) => {
      self.setState( state, settings );
      if ( state === undefined ) {
        self.#streamDeck.showAlert( self.#context );
      }
    });
  }
}

module.exports = StreamDeckActionPrev;
