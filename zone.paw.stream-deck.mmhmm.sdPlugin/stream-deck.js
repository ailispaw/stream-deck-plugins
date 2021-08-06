const logger = require( './logger' );

const DESTINATION = Object.freeze({
  HARDWARE_AND_SOFTWARE : 0,
  HARDWARE_ONLY         : 1,
  SOFTWARE_ONLY         : 2
});

class StreamDeck {
  constructor ( port, uuid, event, info ) {
    this.port  = port;
    this.uiid  = uuid;
    this.event = event;
    this.info  = info;
    logger.info( 'StreamDeck: info: %o', info );

    const WebSocket  = require( 'ws' );
    this.websocket = new WebSocket( 'ws://127.0.0.1:' + port );;
  }

  onOpen ( callback ) {
    var self = this;
    this.websocket.on( 'open', ( event ) => {
      logger.debug( 'onOpen: event: %o', event );
      self.websocket.send( JSON.stringify({
        event : self.event,
        uuid  : self.uiid
      }), callback );
    });
  }

  onClose ( callback ) {
    this.websocket.on( 'close', ( event ) => {
      logger.debug( 'onClose: event: %o', event );
      if ( typeof callback == 'function' ) {
        callback( event );
      }
    });
  }

  onMessage ( callback ) {
    this.websocket.on( 'message', ( event ) => {
      var json = JSON.parse( event );
      logger.debug( 'onMessage: event: %o', json );
      if ( typeof callback == 'function' ) {
        callback( json );
      }
    });
  }

  setState ( context, state, callback ) {
    this.websocket.send( JSON.stringify({
      event   : 'setState',
      context : context,
      payload : {
        state : state
      }
    }), callback );
  }

  setSettings ( context, settings, callback ) {
    this.websocket.send( JSON.stringify({
      event   : 'setSettings',
      context : context,
      payload : settings
    }), callback );
  }

  setImage ( context, state, imagePath, callback ) {
    const fs = require('fs');
    var image64 = '';
    if ( imagePath ) {
      image64 = 'data:image/png;base64,' + fs.readFileSync( imagePath, { encoding: 'base64' } );
    }
    this.websocket.send( JSON.stringify({
      event   : 'setImage',
      context : context,
      payload : {
        image  : image64,
        target : DESTINATION.HARDWARE_AND_SOFTWARE,
        state  : state
      }
    }), callback );
  }

  showAlert ( context, callback ) {
    this.websocket.send( JSON.stringify({
      event   : 'showAlert',
      context : context
    }), callback );
  }
}

module.exports = StreamDeck;