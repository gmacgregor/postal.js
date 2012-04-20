module.exports = function( _, postal ) {
	var filters = [],
		applyFilter = function ( filter, env ) {
			var match = 0, possible = 0;
			_.each( filter, function ( item, key ) {
				if ( env[key] ) {
					possible++;
					if ( _.isObject( env[key] ) && !_.isArray( env[key] ) ) {
						if ( applyFilter( item, env[key] ) ) {
							match++;
						}
					}
					else {
						if ( _.isEqual( env[key], item ) ) {
							match++;
						}
					}
				}
			} );
			return match === possible;
		};
	
	// this returns a callback that, if invoked, removes the wireTap
	var wireTap = postal.addWireTap( function ( data, envelope ) {
		if ( !filters.length || _.any( filters, function ( filter ) {
			return applyFilter( filter, envelope );
		} ) ) {
			if ( !JSON ) {
				throw "This browser or environment does not provide JSON support";
			}
			try {
				console.log( JSON.stringify( envelope ) );
			}
			catch ( exception ) {
				try {
					var env = _.extend( {}, envelope );
					delete env.data;
					console.log( JSON.stringify( env ) + "\n\t" + "JSON.stringify Error: " + exception.message );
				}
				catch ( ex ) {
					console.log( "Unable to parse data to JSON: " + exception );
				}
			}
		}
	} );
	
	postal.diagnostics = {
		clearFilters : function () {
			filters = [];
		},
		removeFilter : function ( filter ) {
			filters = _.filter( filters, function ( item ) {
				return !_.isEqual( item, filter );
			} );
		},
		addFilter : function ( constraint ) {
			if ( !_.isArray( constraint ) ) {
				constraint = [ constraint ];
			}
			_.each( constraint, function( item ){
				if ( filters.length === 0 || !_.any( filters, function ( filter ) {
					return _.isEqual( filter, item );
				} ) ) {
					filters.push( item );
				}
			});
	
		},
		getCurrentFilters : function () {
			return filters;
		},
		removeWireTap : function () {
			if ( wireTap ) {
				wireTap();
			}
		}
	};
	
	
};