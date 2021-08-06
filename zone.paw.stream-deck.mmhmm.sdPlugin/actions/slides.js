const mmhmm = require( '../mmhmm' );

const STATE = Object.freeze({
  OFF_AIR  : 0,
  ON_AIR   : 1,
  DISABLED : 2
});

class StreamDeckActionSlides {
  #streamDeck;
  #context;

  constructor ( streamDeck, context ) {
    this.#streamDeck = streamDeck;
    this.#context    = context;
  }

  setState ( active_mode, settings ) {
    if ( active_mode !== undefined ) {
      var state = ( settings.slides_mode == active_mode );
      this.#streamDeck.setState( this.#context, ( state ? STATE.ON_AIR : STATE.OFF_AIR ) );
    } else {
      this.disable();
    }
  }

  updateState ( settings ) {
    var self = this;
    mmhmm.slides( settings.slides_mode ).then(( state ) => {
      self.setState( ( state ? settings.slides_mode : state ), settings );
    });
  }

  disable () {
    this.#streamDeck.setState( this.#context, STATE.DISABLED );
  }

  onKeyUp ( settings ) {
    var self = this;
    mmhmm.slides( settings.slides_mode, true ).then(( state ) => {
      self.setState( ( state ? settings.slides_mode : state ), settings );
      if ( state === undefined ) {
        self.#streamDeck.showAlert( self.#context );
      }
    });
  }
}

module.exports = StreamDeckActionSlides;
