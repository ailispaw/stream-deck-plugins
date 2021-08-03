#!/usr/local/bin/node --inspect

const utils  = require( './utils' );
const logger = require( './logger' );
const mmhmm  = require( './mmhmm' );

const actions = {
  'zone.paw.stream-deck.mmhmm.actions.away' : require( './actions/away' ),
  'zone.paw.stream-deck.mmhmm.actions.hide' : require( './actions/hide' ),
};

var running = false;
var buttons = {};

function connectElgatoStreamDeckSocket( inPort, inPluginUUID, inRegisterEvent, inInfo ) {
  const StreamDeck = require( './stream-deck' );
  var streamDeck = new StreamDeck( inPort, inPluginUUID, inRegisterEvent, inInfo );

  streamDeck.onOpen( async function ( err ) {
    running = await mmhmm.running();
  });

  streamDeck.onMessage( async function ( message ) {
    switch ( message.event ) {
      case 'didReceiveSettings':
        break;
      case 'didReceiveGlobalSettings':
        break;
      case 'keyDown':
        break;
      case 'keyUp':
        var button = buttons[ message.context ];
        if ( ! running ) {
          button.api.disable();
          streamDeck.showAlert( message.context );
        } else {
          button.api.onKeyUp();
        }
        break;
      case 'willAppear':
        var button = buttons[ message.context ] = {
          action   : message.action,
          state    : message.payload.state,
          settings : message.payload.settings,
          api      : new actions[ message.action ]( streamDeck, message.context )
        };
        logger.debug( 'willAppear: buttons: %o', buttons );
        if ( ! running ) {
          button.api.disable();
        } else {
          button.api.updateState();
        }
        break;
      case 'willDisappear':
        buttons[ message.context ].api.destructor();
        delete buttons[ message.context ].api;
        delete buttons[ message.context ];
        logger.debug( 'willDisappear: buttons: %o', buttons );
        break;
      case 'titleParametersDidChange':
        var button = buttons[ message.context ];
        button.state    = message.payload.state;
        button.title    = message.payload.title;
        button.settings = message.payload.settings;
        logger.debug( 'titleParametersDidChange: buttons: %o', buttons );
        break;
      case 'deviceDidConnect':
        break;
      case 'deviceDidDisconnect':
        break;
      case 'applicationDidLaunch':
        do {
          await utils.sleep( 500 );
          running = await mmhmm.running();
        } while ( ! running );
        logger.debug( 'applicationDidLaunch: running: %s', running );
        await utils.sleep( 500 );
        Object.keys( buttons ).forEach( context => {
          buttons[ context ].api.updateState();
        });
        break;
      case 'applicationDidTerminate':
        do {
          await utils.sleep( 500 );
          running = await mmhmm.running();
        } while ( running );
        logger.debug( 'applicationDidTerminate: running: %s', running );
        await utils.sleep( 500 );
        Object.keys( buttons ).forEach( context => {
          buttons[ context ].api.disable();
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
}

if ( require.main === module ) {
  const args = process.argv.slice( 2 );
  logger.info( 'main: args: %o', args );
  connectElgatoStreamDeckSocket( args[ 1 ],  args[ 3 ], args[ 5 ], JSON.parse( args[ 7 ] ) );
}
