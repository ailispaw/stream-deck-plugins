ObjC.import( 'Cocoa' );
var args = ObjC.deepUnwrap( $.NSProcessInfo.processInfo.arguments ).slice( 4 );

var sys = Application('System Events');

try {
	var proc = sys.processes.byName("mmhmm");

	var win = proc.windows.whose({
		description: 'standard window'
	})[0];

	var group = win.groups.whose({
		description: 'Inspectors'
	})[0];

	group.checkboxes.byName('Presenter').click();

	var away = group.scrollAreas[0].groups[0].uiElements.byName('Away');
	if ( args.length > 0 ) {
		away.click();
	}
	away.value() == 1;
} catch ( e ) {
	undefined;
}