const osascript = require( 'osascript' ).file;
const logger    = require( './logger' );
const utils     = require( './utils' );

class mmhmm {
  running () {
    return new Promise( resolve => {
      osascript( 'JXA/running.js', function ( err, data ) {
        var running = utils.primitiveEval( data );
        logger.debug( 'mmhmm: running: %s', running );
        resolve( running );
      });
    });
  }

  away ( click = false ) {
    return new Promise( resolve => {
      osascript( 'JXA/away.js', {
        args: ( click ? [ click ] : [] )
      }, function ( err, data ) {
        var away = utils.primitiveEval( data );
        logger.debug( 'mmhmm: away: %s', away );
        resolve( away );
      });
    });
  }

  hide ( click = false ) {
    return new Promise( resolve => {
      osascript( 'JXA/hide.js', {
        args: ( click ? [ click ] : [] )
      }, function ( err, data ) {
        var hiding = utils.primitiveEval( data );
        logger.debug( 'mmhmm: hiding: %s', hiding );
        resolve( hiding );
      });
    });
  }

  scene ( name, click = false ) {
    return new Promise( resolve => {
      osascript( 'JXA/scene.js', {
        args: ( click ? [ name, click, __dirname ] : [ name ] )
      }, function ( err, data ) {
        var scene = utils.primitiveEval( data );
        logger.debug( 'mmhmm: scene: %s %s', name, scene );
        resolve( scene );
      });
    });
  }
}

module.exports = new mmhmm();
