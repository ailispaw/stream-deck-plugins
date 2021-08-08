const mmhmm = require( '../mmhmm' );

const STATE = Object.freeze({
  OFF_AIR  : 0,
  ON_AIR   : 1,
  DISABLED : 2
});

class StreamDeckActionScene {
  #streamDeck;
  #context;
  #state;

  constructor ( streamDeck, context ) {
    this.#streamDeck = streamDeck;
    this.#context    = context;
  }

  setState ( active_scene, settings, force = false ) {
    if ( active_scene !== undefined ) {
      var state = ( settings.scene_name == active_scene );
      if ( ( ! force ) && ( this.#state === state)  ) {
        return;
      }
      this.#state = state;
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
    if ( this.#state === undefined ) {
      return;
    }
    this.#state = undefined;
    this.#streamDeck.setState( this.#context, STATE.DISABLED );
  }

  onKeyUp ( settings ) {
    var self = this;
    mmhmm.scene( settings.scene_name, true ).then(( state ) => {
      self.setState( ( state ? settings.scene_name : state ), settings, true );
      if ( state === undefined ) {
        self.#streamDeck.showAlert( self.#context );
      }
    });
  }
}

module.exports = StreamDeckActionScene;
