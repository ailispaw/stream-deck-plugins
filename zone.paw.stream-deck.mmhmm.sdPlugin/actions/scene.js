const mmhmm = require( '../mmhmm' );

const STATE = Object.freeze({
  OFF_AIR  : 0,
  ON_AIR   : 1,
  DISABLED : 2
});

class StreamDeckActionScene {
  #streamDeck;
  #context;

  constructor ( streamDeck, context ) {
    this.#streamDeck = streamDeck;
    this.#context    = context;
  }

  updateState ( settings ) {
    var self = this;
    mmhmm.scene( settings.scene_name ).then( function ( scene ) {
      if ( scene !== undefined ) {
        self.#streamDeck.setState( self.#context, ( scene ? STATE.ON_AIR : STATE.OFF_AIR ) );
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
    mmhmm.scene( settings.scene_name, true ).then( function ( scene ) {
      if ( scene !== undefined ) {
        self.#streamDeck.setState( self.#context, ( scene ? STATE.ON_AIR : STATE.OFF_AIR ) );
      } else {
        self.#streamDeck.setState( self.#context, STATE.DISABLED );
        self.#streamDeck.showAlert( self.#context );
      }
    });
  }
}

module.exports = StreamDeckActionScene;
