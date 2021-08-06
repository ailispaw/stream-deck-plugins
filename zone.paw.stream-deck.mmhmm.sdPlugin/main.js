#!/usr/local/bin/node --inspect

const utils  = require( './utils' );
const logger = require( './logger' );
const mmhmm  = require( './mmhmm' );

const actions = {
  'away'   : require( './actions/away' ),
  'hide'   : require( './actions/hide' ),
  'scene'  : require( './actions/scene' ),
  'slides' : require( './actions/slides' ),
  'next'   : require( './actions/next' ),
  'prev'   : require( './actions/prev' ),
};

var buttons = {};

function connectElgatoStreamDeckSocket( inPort, inPluginUUID, inRegisterEvent, inInfo ) {
  const StreamDeck = require( './stream-deck' );
  var streamDeck = new StreamDeck( inPort, inPluginUUID, inRegisterEvent, inInfo );

  streamDeck.onOpen(( err ) => {
    mmhmm.running().then(( running ) => {
      if ( running ) {
        stateObserver.start();
      } else {
        stateObserver.updateState();
      }
    });
  });

  streamDeck.onClose(() => {
    stateObserver.stop();
  });

  streamDeck.onMessage(( message ) => {
    switch ( message.event ) {
      case 'didReceiveSettings':
        var button = buttons[ message.context ];
        button.state    = message.payload.state;
        button.settings = message.payload.settings;
        logger.debug( 'didReceiveSettings: buttons: %o', buttons );
        button.api.updateState( button.settings );
        break;
      case 'didReceiveGlobalSettings':
        break;
      case 'keyDown':
        break;
      case 'keyUp':
        var button = buttons[ message.context ];
        button.api.onKeyUp( button.settings );
        break;
      case 'willAppear':
        var arrAction = message.action.split( '.' );
        var action = arrAction[ arrAction.length - 1 ];
        var button = buttons[ message.context ] = {
          action   : action,
          state    : message.payload.state,
          settings : message.payload.settings,
          api      : new actions[ action ]( streamDeck, message.context )
        };
        logger.debug( 'willAppear: buttons: %o', buttons );
        button.api.updateState( button.settings );
        break;
      case 'willDisappear':
        if ( buttons[ message.context ] ) {
          delete buttons[ message.context ].api;
          delete buttons[ message.context ];
        }
        logger.debug( 'willDisappear: buttons: %o', buttons );
        break;
      case 'titleParametersDidChange':
        var button = buttons[ message.context ];
        button.state    = message.payload.state;
        button.title    = message.payload.title;
        button.settings = message.payload.settings;
        logger.debug( 'titleParametersDidChange: buttons: %o', buttons );
        button.api.updateState( button.settings );
        break;
      case 'deviceDidConnect':
        break;
      case 'deviceDidDisconnect':
        break;
      case 'applicationDidLaunch':
        stateObserver.start();
        break;
      case 'applicationDidTerminate':
        stateObserver.stop();
        Object.keys( buttons ).forEach( async ( context ) => {
          buttons[ context ].api.disable();
          await utils.sleep( 500 );
        });
        break;
      case 'systemDidWakeUp':
        break;
      case 'propertyInspectorDidAppear':
        break;
      case 'propertyInspectorDidDisappear':
        break;
      case 'sendToPlugin':
        break;
      default:
    }
  });

  var stateObserver = {
    timer     : null,
    interval  : 1000,
    observing : false,

    start : function () {
      if ( this.observing ) {
        return;
      }
      this.observing = true;
      this.updateState( true );
    },

    stop : function () {
      this.observing = false;
      if ( this.timer ) {
        clearTimeout( this.timer );
        this.timer = null;
      }
    },

    updateState: function ( continuous = false ) {
      if ( this.timer && continuous ) {
        clearTimeout( this.timer );
        this.timer = null;
      }
      if ( Object.keys( buttons ).length ) {
        mmhmm.state().then(( state ) => {
          Object.keys( buttons ).forEach( async ( context ) => {
            buttons[ context ].api.setState( state[ buttons[ context ].action ], buttons[ context ].settings );
            await utils.sleep( 500 );
          });
        });
      }
      if ( this.observing && continuous ) {
        var self = this;
        this.timer = setTimeout(() => {
          self.updateState( true );
        }, this.interval );
      }
    }
  };
}

if ( require.main === module ) {
  const args = process.argv.slice( 2 );
  logger.info( 'main: args: %o', args );
  connectElgatoStreamDeckSocket( args[ 1 ],  args[ 3 ], args[ 5 ], JSON.parse( args[ 7 ] ) );
}
