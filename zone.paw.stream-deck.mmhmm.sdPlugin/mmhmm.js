const osascript = require( 'osascript' ).file;
const logger    = require( './logger' );
const utils     = require( './utils' );

class mmhmm {
  running () {
    return new Promise( resolve => {
      osascript( 'JXA/running.jxa', function ( err, data ) {
        var running = utils.primitiveEval( data );
        logger.debug( 'mmhmm: running: %s', running );
        resolve( running );
      });
    });
  }

  state () {
    return new Promise( resolve => {
      osascript( 'JXA/state.jxa', function ( err, data ) {
        var state = JSON.parse( data );
        logger.debug( 'mmhmm: state: %o', state );
        resolve( state );
      });
    });
  }

  away ( click = false ) {
    return new Promise( resolve => {
      osascript( 'JXA/away.jxa', {
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
      osascript( 'JXA/hide.jxa', {
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
      osascript( 'JXA/scene.jxa', {
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
