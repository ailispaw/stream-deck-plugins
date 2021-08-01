#!/usr/local/bin/node --inspect

const osascript = require( 'osascript' ).file;
const logger    = require( './logger' );

var running = false;
var buttons = {};

function connectElgatoStreamDeckSocket( inPort, inPluginUUID, inRegisterEvent, inInfo ) {
  const StreamDeck = require( './stream-deck' );
  var streamDeck = new StreamDeck( inPort, inPluginUUID, inRegisterEvent, inInfo );

  streamDeck.onOpen( function ( err ) {
    osascript( 'JXA/running.js', function ( err, data ) {
      running = eval( data.trim() );
      logger.info( 'running: %s', running );
    });
  });

  streamDeck.onMessage( function ( message ) {
    switch ( message['event'] ) {
      case 'didReceiveSettings':
        break;
      case 'didReceiveGlobalSettings':
        break;
      case 'keyDown':
        break;
      case 'keyUp':
        if ( ! running ) {
          streamDeck.setState( message.context, 2 );
          streamDeck.showAlert( message.context );
        }
        break;
      case 'willAppear':
        buttons[ message.context ] = {
          action   : message.action,
          state    : message.payload.state,
          settings : message.payload.settings
        };
        logger.info( 'willAppear: buttons: %o', buttons );
        if ( ! running ) {
          streamDeck.setState( message.context, 2 );
        }
        break;
      case 'willDisappear':
        delete buttons[ message.context ];
        logger.info( 'willDisappear: buttons: %o', buttons );
        break;
      case 'titleParametersDidChange':
        buttons[ message.context ] = {
          action   : message.action,
          state    : message.payload.state,
          title    : message.payload.title,
          settings : message.payload.settings
        };
        logger.info( 'titleParametersDidChange: buttons: %o', buttons );
        break;
      case 'deviceDidConnect':
        break;
      case 'deviceDidDisconnect':
        break;
      case 'applicationDidLaunch':
        running = true;
        logger.info( 'applicationDidLaunch: running: %s', running );
        // check all button statuses
        break;
      case 'applicationDidTerminate':
        running = false;
        logger.info( 'applicationDidTerminate: running: %s', running );
        Object.keys( buttons ).forEach( context => {
          streamDeck.setState( context, 2 );
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
  const args = process.argv.slice(2);
  logger.info( 'main: args: %o', args );
  connectElgatoStreamDeckSocket( args[1],  args[3], args[5], JSON.parse( args[7] ) );
}
