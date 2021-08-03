module.exports = {
  sleep : function ( ms ) {
    return new Promise( resolve => setTimeout( resolve, ms ) );
  },

  primitiveEval : function ( val ) {
    if ( typeof val === 'string' ) {
      val = val.trim();
      switch ( val ) {
        case 'true':      // eval('true') => true          , Number('true') => NaN
        case 'false':     // eval('false') => false        , Number('false') => NaN
        case 'null':      // eval('null') => null          , Number('null') => NaN
        case 'undefined': // eval('undefined') => undefined, Number('undefined') => NaN
        case 'NaN':       // eval('NaN') => NaN            , Number('NaN') => NaN
        case '':          // eval('') => undefined         , Number('') => 0
          return eval( val );
        default:
          var num = Number( val );
          if ( num !== NaN ) {
            return num;
          }
          return val;
      }
    }
    return val;
  },
};
