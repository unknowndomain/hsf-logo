var points = Array( 30 );
var triangleLayer;

window.onload = function() {
	paper.setup( document.getElementById( 'logo' ) );
	paper.install( window );

	var shape = [
		[ 75, 231 ],
		[ 115, 191 ],
		[ 189, 265 ],
		[ 264, 189 ],
		[ 190, 115 ],
		[ 230, 75 ],
		[ 425, 269 ],
		[ 384, 309 ],
		[ 298, 223 ],
		[ 222, 298 ],
		[ 309, 384 ],
		[ 269, 425 ],
		[ 75, 231 ]
	];

	// Draw outline circle
	var circle = new Path.Circle( new Point( logo.width / 4, logo.height / 4 ), ( logo.width / 4 ) - 10 );
	circle.strokeColor = 'black';
	circle.strokeWidth = 2;

	// Draw letter H
	var path = new Path();
	for ( var point in shape ) {
		path.add( new Point( shape[point][0], shape[point][1] ) );
	}
	path.closePath();
	path.strokeColor = 'black';
	path.strokeWidth = 2;

	// Create points along the H
	for ( i = points.length; i -- ; ) {
		var p = path.getLocationAt( Math.random() * path.length ).point;
		points[i] = p;
	}

	triangleLayer = new Layer();

	view.onClick = save;

	view.onFrame = function() {
		for ( var p = 0; p < points.length; p++ ) {
			var offset = path.getLocationOf( points[p] ).offset;
			offset += Math.random()/2;
			if ( offset > path.length ) offset = 0;
			var curve = path.getLocationAt( offset );
			points[p] = curve.point;
		}
		DelaunayRender( points );
	};
};

function save() {
	window.open( logo.toDataURL() );
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
		path.strokeColor = 'rgba( 0, 0, 0, 0.1 )';
		path.strokeWidth = 1;
		--i; addVertexPath( path, vertices[triangles[i]] );
		--i; addVertexPath( path, vertices[triangles[i]] );
		--i; addVertexPath( path, vertices[triangles[i]] );
		triangleLayer.addChild( path );
	}
}

function addVertexPath( path, vertex ) {
	var point = new Point( vertex[0], vertex[1] );
	path.add( point );
	var circle = new Path.Circle( point, 2 );
	circle.fillColor = 'black';
	triangleLayer.addChild( circle );
}
