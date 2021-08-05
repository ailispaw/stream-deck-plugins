module.exports = {
  click: function ( app, x, y ) {
    var mouseLoc = $.NSEvent.mouseLocation;
    app.activate();
    delay( 0.1 );
    app = Application.currentApplication();
    app.includeStandardAdditions = true;
    var bounds = app.runScript(`
      use scripting additions
      use framework "AppKit"
      frame() of firstObject() of screens() of NSScreen of current application
    `);
    app.doShellScript( '/usr/local/bin/cliclick c:=' + app.round( x ) + ',=' + app.round( y ) );
    app.doShellScript( '/usr/local/bin/cliclick m:=' + app.round( mouseLoc.x ) + ',=' + app.round( bounds[1][1] - mouseLoc.y ) );
  }
};
