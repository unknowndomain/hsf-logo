var points = Array( 25 );
var triangleLayer;
var thickness = 1;
var speed = 2;

window.onload = function() {
	// Setup paper.js
	paper.setup( document.getElementById( 'canvas' ) );
	paper.install( window );

	// Save PNG on lick
	view.onClick = save;

	// Import SVG
	paper.projects[0].importSVG( 'https://raw.githubusercontent.com/unknowndomain/hsf-logo/master/logo.svg', {
		insert: false,
		onLoad: setup
	} );
};

function setup( item, svg ) {
	// Draw outline circle
	var circle = new Path.Circle( paper.view.center, paper.view.size.height * 0.48 );
	// circle.strokeColor = 'black';
	circle.fillColor = 'black';
	// circle.strokeWidth = 2;

	// Process SVG into H-shape
	path = item.children[1].children[0].children[0];
	paper.projects[0].layers[0].addChild( path );
	path.strokeColor = 'white';
	path.strokeWidth = 2;
	// path.fillColor = 'white';
	path.fitBounds( new Size( paper.view.size.width * 0.8, paper.view.size.height * 0.8 ) );
	path.translate( new Point(
		paper.view.center.x - path.bounds.center.x,
		paper.view.center.y - path.bounds.center.y
	) );
	path.applyMatrix = true;

	// Create points along the H
	for ( i = points.length; i -- ; ) {
		var p = path.getLocationAt( Math.random() * path.length ).point;
		points[i] = p;
	}

	// Create empty layer for delaunay triangles
	triangleLayer = new Layer();
	// triangleLayer.sendToBack();

	// On new frame redraw
	view.onFrame = drawFrame;
};

function drawFrame() {
	// Move each point along the path up by a random amount
	for ( var p = 0; p < points.length; p++ ) {
		var offset = path.getLocationOf( points[p] ).offset;
		offset += Math.random() / speed;
		if ( offset > path.length ) offset = 0;
		var curve = path.getLocationAt( offset );
		points[p] = curve.point;
	}

	// Render the triangles
	DelaunayRender( points );
}

function DelaunayRender( points ) {
	var vertices = [];
	for ( var p in points ) {
		vertices.push( [ points[p].x, points[p].y ] );
	}

	triangleLayer.removeChildren();

	var triangles = Delaunay.triangulate( vertices );
	for ( i = triangles.length; i; ) {
		var path = new Path();
		// path.strokeColor = 'rgba( 0, 0, 255, 0.15 )';
		path.strokeColor = 'rgba( 255, 255, 255, .25 )';
		// path.strokeColor = 'rgba( 0, 0, 0, .25 )';
		path.strokeWidth = 2;
		path.strokeJoin = 'round';
		--i; addVertexPath( path, vertices[triangles[i]] );
		--i; addVertexPath( path, vertices[triangles[i]] );
		--i; addVertexPath( path, vertices[triangles[i]] );
		triangleLayer.addChild( path );
	}
}

function addVertexPath( path, vertex ) {
	var point = new Point( vertex[0], vertex[1] );
	path.add( point );
	var circle = new Path.Circle( point, 3 );
	circle.fillColor = 'white';
	triangleLayer.addChild( circle );
}

function save() {
	window.open( canvas.toDataURL() );
}
