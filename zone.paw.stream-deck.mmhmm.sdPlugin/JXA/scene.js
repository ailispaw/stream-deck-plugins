// https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts#emulating-npms-require
var require = function ( path ) {
  ObjC.import( 'Foundation' );
  var contents = $.NSFileManager.defaultManager.contentsAtPath( path.toString() ); // NSData
  contents = $.NSString.alloc.initWithDataEncoding( contents, $.NSUTF8StringEncoding );
  var module = {exports: {}};
  eval( ObjC.unwrap( contents ) );
  return module.exports;
};

ObjC.import( 'Cocoa' );
var args = ObjC.deepUnwrap( $.NSProcessInfo.processInfo.arguments ).slice( 4 );

(( name, click = false, rootDir = '' ) => {
  var app = Application( 'mmhmm.app' );
  if ( ! app.running() ) {
    return;
  }
  try {
    var sys  = Application( 'System Events' );
    var proc = sys.processes.byName( 'mmhmm' );
    var win  = proc.windows.whose({ description: 'standard window' })[0];
    if ( click && ( win.name() != name ) ) {
      var scene = win.tabGroups.byName( 'Tab Bar' ).radioButtons.byName( name );
      var pos   = scene.position();
      var size  = scene.size();
      var utils = require( rootDir + '/JXA/utils.js' );
      utils.click( app, pos[0] + ( size[0] / 2 ), pos[1] + ( size[1] / 2 ) );
    }
    return ( win.name() == name );
  } catch ( e ) {}
}).apply( this, args );
