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

  setState ( state, settings ) {
    if ( state !== undefined ) {
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
    this.#streamDeck.setState( this.#context, STATE.DISABLED );
  }

  onKeyUp ( settings ) {
    var self = this;
    mmhmm.away( true ).then(( state ) => {
      self.setState( state, settings );
      if ( state === undefined ) {
        self.#streamDeck.showAlert( self.#context );
      }
    });
  }
}

module.exports = StreamDeckActionAway;
