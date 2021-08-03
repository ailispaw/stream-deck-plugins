const mmhmm = require( '../mmhmm' );

const STATE = Object.freeze({
  HIDING   : 0,
  SHOWING  : 1,
  DISABLED : 2
});

class StreamDeckActionHide {
  #streamDeck;
  #context;

  #timer    = null;
  #interval = 1000;

  #destructed = false;

  constructor ( streamDeck, context ) {
    this.#streamDeck = streamDeck;
    this.#context    = context;

    var self = this;
    this.#timer = setTimeout( function () {
      self.updateState();
    }, this.#interval );
  }

  destructor () {
    if ( this.#timer ) {
      clearTimeout( this.#timer );
      this.#timer = null;
    }
    this.#destructed = true;
  }

  updateState () {
    if ( this.#timer ) {
      clearTimeout( this.#timer );
      this.#timer = null;
    }
    if ( this.#destructed ) {
      return;
    }
    var self = this;
    mmhmm.hide().then( function ( hiding ) {
      if ( hiding !== undefined ) {
        self.#streamDeck.setState( self.#context, ( hiding ? STATE.HIDING : STATE.SHOWING ) );
      } else {
        self.#streamDeck.setState( self.#context, STATE.DISABLED );
      }
      self.#timer = setTimeout( function () {
        self.updateState();
      }, self.#interval );
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
      }
    });
  }
}

module.exports = StreamDeckActionHide;
