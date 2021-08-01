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
    this.websocket.on( 'open', function () {
      self.websocket.send( JSON.stringify({
        event : self.event,
        uuid  : self.uiid
      }), callback );
    });
  }

  onMessage ( callback ) {
    this.websocket.on( 'message', function ( event ) {
      var json = JSON.parse( event );
      logger.info( 'onMessage: event: %o', json );
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

  showAlert ( context, callback ) {
    this.websocket.send( JSON.stringify({
      event   : 'showAlert',
      context : context
    }), callback );
  }
}

module.exports = StreamDeck;