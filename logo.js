var points = Array( 30 );
var triangleLayer;
var thickness = 1;
var speed = 2;

window.onload = function() {
	var logo = document.getElementById( 'logo' );
	paper.setup( logo );
	paper.install( window );

	// Draw outline circle
	var circle = new Path.Circle( paper.view.center, paper.view.size.height * 0.49 );
	circle.strokeColor = 'black';
	circle.strokeWidth = thickness;

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

	// Draw letter H
	var path = new Path();
	for ( var point in shape ) {
		path.add( new Point( shape[point][0], shape[point][1] ) );
	}
	path.closePath();
	path.strokeColor = 'black';
	path.strokeWidth = thickness;
	path.fitBounds( new Size( paper.view.size.width * 0.8, paper.view.size.height * 0.8 ) );
	path.translate( new Point(
		paper.view.center.x - path.bounds.center.x,
		paper.view.center.y - path.bounds.center.y
	) );

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
			offset += Math.random() / speed;
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
		path.strokeWidth = thickness;
		--i; addVertexPath( path, vertices[triangles[i]] );
		--i; addVertexPath( path, vertices[triangles[i]] );
		--i; addVertexPath( path, vertices[triangles[i]] );
		triangleLayer.addChild( path );
	}
}

function addVertexPath( path, vertex ) {
	var point = new Point( vertex[0], vertex[1] );
	path.add( point );
	var circle = new Path.Circle( point, thickness * 1.25 );
	circle.fillColor = 'black';
	triangleLayer.addChild( circle );
}
