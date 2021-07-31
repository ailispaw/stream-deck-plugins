#!/usr/local/bin/node --inspect

const winston = require( 'winston' );
const logger  = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'console.log' }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exceptions.log' })
  ]
});
const osascript = require( 'osascript' ).file;

const args = process.argv.slice(2);
logger.info( 'args: %o', args );
connectElgatoStreamDeckSocket( args[1],  args[3], args[5], JSON.parse( args[7] ) );

function connectElgatoStreamDeckSocket( inPort, inPluginUUID, inRegisterEvent, inInfo ) {
  logger.info( 'inInfo: %o', inInfo );

  var DESTINATION = Object.freeze({
    HARDWARE_AND_SOFTWARE : 0,
    HARDWARE_ONLY         : 1,
    SOFTWARE_ONLY         : 2
  });

  var WebSocket = require( 'ws' );
  var websocket = new WebSocket( 'ws://127.0.0.1:' + inPort );

  websocket.on( 'open', function () {
    // WebSocket is connected, send message
    websocket.send( JSON.stringify({
      event : inRegisterEvent,
      uuid  : inPluginUUID
    }) );
  });

  websocket.on( 'close', function () {
    // Websocket is closed
  });

  var isRunning = false;
  osascript( 'JXA/is_running.js', function ( err, data ) {
    isRunning = eval( data.trim() );
    logger.info( 'isRunning: %s', isRunning );
  });
  var buttons = {};

  websocket.on( 'message', function ( event ) {
    var json = JSON.parse( event );
    logger.info( 'event: %o', json );
    switch ( json['event'] ) {
      case 'didReceiveSettings':
        break;
      case 'didReceiveGlobalSettings':
        break;
      case 'keyDown':
        break;
      case 'keyUp':
        if ( ! isRunning ) {
          setState( json.context, 2 );
          showAlert( json.context );
       }
        break;
      case 'willAppear':
        buttons[ json.context ] = {
          action   : json.action,
          state    : json.payload.state,
          settings : json.payload.settings
        };
        logger.info( 'buttons: %o', buttons );
        if ( ! isRunning ) {
          setState( json.context, 2 );
        }
        break;
      case 'willDisappear':
        delete buttons[ json.context ];
        logger.info( 'buttons: %o', buttons );
        break;
      case 'titleParametersDidChange':
        buttons[ json.context ] = {
          action   : json.action,
          state    : json.payload.state,
          title    : json.payload.title,
          settings : json.payload.settings
        };
        logger.info( 'buttons: %o', buttons );
        break;
      case 'deviceDidConnect':
        break;
      case 'deviceDidDisconnect':
        break;
      case 'applicationDidLaunch':
        isRunning = true;
        logger.info( 'isRunning: %s', isRunning );
        // check all button statuses
        break;
      case 'applicationDidTerminate':
        isRunning = false;
        logger.info( 'isRunning: %s', isRunning );
        Object.keys( buttons ).forEach( context => {
          setState( context, 2 );
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

  function setState ( context, state ) {
    websocket.send( JSON.stringify({
      event   : 'setState',
      context : context,
      payload : {
        state : state
      }
    }) );
  }

  function setSettings ( context, settings ) {
    websocket.send( JSON.stringify({
      event   : 'setSettings',
      context : context,
      payload : settings
    }) );
  }

  function showAlert ( context ) {
    websocket.send( JSON.stringify({
      event   : 'showAlert',
      context : context
    }) );
  }
}

/*
var osascript = require('osascript').file;
osascript( 'main.js', {
  args: process.argv.slice(2)
}).pipe( process.stdout );
*/
