ObjC.import( 'Cocoa' );
var args = ObjC.deepUnwrap( $.NSProcessInfo.processInfo.arguments ).slice( 4 );

(function ( click = false ) {
  var app = Application( 'mmhmm.app' );
  if ( ! app.running() ) {
    return;
  }
  try {
    var sys   = Application( 'System Events' );
    var proc  = sys.processes.byName( 'mmhmm' );
    var win   = proc.windows.whose({ description: 'standard window' })[0];
    var group = win.groups.whose({ description: 'Inspectors' })[0];
    group.checkboxes.byName( 'Presenter' ).click();

    if ( click ) {
      group.scrollAreas[0].buttons.whose({ help: 'Hide presenter (/)' })[0].click();
    }
    var slider = group.scrollAreas[0].sliders.whose({ help: 'Adjust the presenter opacity' })[0];
    return ( slider.value() == 0 );
  } catch ( e ) {}
}).apply( this, args );
