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

  setState ( active_scene, settings ) {
    if ( active_scene !== undefined ) {
      var state = ( settings.scene_name == active_scene );
      this.#streamDeck.setState( this.#context, ( state ? STATE.ON_AIR : STATE.OFF_AIR ) );
    } else {
      this.disable();
    }
  }

  updateState ( settings ) {
    var self = this;
    mmhmm.scene( settings.scene_name ).then(( state ) => {
      self.setState( ( state ? settings.scene_name : state ), settings );
    });
  }

  disable () {
    this.#streamDeck.setState( this.#context, STATE.DISABLED );
  }

  onKeyUp ( settings ) {
    var self = this;
    mmhmm.scene( settings.scene_name, true ).then(( state ) => {
      self.setState( ( state ? settings.scene_name : state ), settings );
      if ( state === undefined ) {
        self.#streamDeck.showAlert( self.#context );
      }
    });
  }
}

module.exports = StreamDeckActionScene;
