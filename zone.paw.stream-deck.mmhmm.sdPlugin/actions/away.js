const mmhmm = require( '../mmhmm' );

const STATE = Object.freeze({
  ON_AIR   : 0,
  OFF_AIR  : 1,
  DISABLED : 2
});

class StreamDeckActionAway {
  #streamDeck;
  #context;
  #state = null;

  constructor ( streamDeck, context ) {
    this.#streamDeck = streamDeck;
    this.#context    = context;
  }

  setState ( state, settings, force = false ) {
    if ( state !== undefined ) {
      if ( ( ! force ) && ( this.#state === state)  ) {
        return;
      }
      this.#state = state;
      this.#streamDeck.setState( this.#context, ( state ? STATE.OFF_AIR : STATE.ON_AIR ) );
    } else {
      this.disable();
    }
  }

  updateState ( settings ) {
    var self = this;
    mmhmm.away().then(( state ) => {
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
    mmhmm.away( true ).then(( state ) => {
      self.setState( state, settings, true  );
      if ( state === undefined ) {
        self.#streamDeck.showAlert( self.#context );
      }
    });
  }
}

module.exports = StreamDeckActionAway;
