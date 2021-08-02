const osascript = require( 'osascript' ).file;
const logger    = require( './logger' );

class mmhmm {
  running () {
    return new Promise( resolve => {
      osascript( 'JXA/running.js', function ( err, data ) {
        var running = eval( data.trim() );
        logger.debug( 'mmhmm: running: %s', running );
        resolve( running );
      });
    });
  }

  away ( click ) {
    return new Promise( resolve => {
      osascript( 'JXA/away.js', {
        args: ( click ? [ click ] : [] )
      }, function ( err, data ) {
        var away = eval( data.trim() );
        logger.debug( 'mmhmm: away: %s', away );
        resolve( away );
      });
    });
  }
}

module.exports = new mmhmm();
