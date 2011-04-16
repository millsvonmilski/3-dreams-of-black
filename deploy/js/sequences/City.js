var City = function ( shared ) {

	SequencerItem.call( this );

	var camera, world, soup,
	cameraStraight, cameraRight, cameraLeft,
	renderer = shared.renderer, renderTarget = shared.renderTarget,
	waypointsStraight = [], waypointsRight = [], waypointsLeft = [], delta, time, oldTime;
	var switched = false;

	// temp debug, start with ?debug=true
	shared.debug = false;
	if (getParameterByName("debug") == "true") {
		shared.debug = true;
	}

	this.init = function () {

		waypointsStraight = [ [ 0, 20, 0 ], [ 0, 20, -1570 ], [ 0, 20, -3350 ] ];
		waypointsRight = [ [ 0, 20, 0 ], [ 0, 20, -1570 ], [ 250, 20, -1750 ], [ 1600, 20, -1750 ] ];
		waypointsLeft = [ [ 0, 20, 0 ], [ 0, 20, -1570 ], [ -250, 20, -1750 ], [ -1600, 20, -1750 ] ];

		cameraStraight = new THREE.PathCamera( {

			fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			waypoints: waypointsStraight, duration: 30, 
			useConstantSpeed: true, resamplingCoef: 100,
			createDebugPath: shared.debug, createDebugDummy: true,
			lookSpeed: 0.0020, lookVertical: true, lookHorizontal: true,
			verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 1.0, 1.9 ] },
			horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.4, Math.PI-0.4 ] }

		 } );


		cameraRight = new THREE.PathCamera( {

			fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			waypoints: waypointsRight, duration: 30, 
			useConstantSpeed: true, resamplingCoef: 100,
			createDebugPath: shared.debug, createDebugDummy: true,
			lookSpeed: 0.0020, lookVertical: true, lookHorizontal: true,
			verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 1.0, 1.9 ] },
			horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.4, Math.PI-0.4 ] }

		 } );

		cameraLeft = new THREE.PathCamera( {

			fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			waypoints: waypointsLeft, duration: 30, 
			useConstantSpeed: true, resamplingCoef: 100,
			createDebugPath: shared.debug, createDebugDummy: true,
			lookSpeed: 0.0020, lookVertical: true, lookHorizontal: true,
			verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 1.0, 1.9 ] },
			horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.4, Math.PI-0.4 ] }

		 } );

		camera = cameraStraight;

		camera.position.set( 0, 0, 0 );
		camera.lon = 90;

		/*camera = new THREE.QuakeCamera( {
		fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
		movementSpeed: 100.0, lookSpeed: 0.25, noFly: false, lookVertical: true,
		autoForward: false
		} );
		gui.add( camera.position, 'x' ).name( 'Camera x' ).listen();
		gui.add( camera.position, 'y' ).name( 'Camera y' ).listen();
		gui.add( camera.position, 'z' ).name( 'Camera z' ).listen();
		*/

		world = new CityWorld( shared );
		soup = new CitySoup( camera, world.scene, shared );
		
		if (shared.debug) {
			world.scene.addObject( camera.debugPath );
		}
		world.scene.addObject( camera.animationParent );
		world.scene.addObject( cameraRight.animationParent );
		world.scene.addObject( cameraLeft.animationParent );


		shared.signals.cameraFov.add( function ( value ) {

			camera.fov = value;
			camera.updateProjectionMatrix();

		} );

	};

	this.show = function ( f ) {

		oldTime = new Date().getTime();
		
		camera.animation.play( true, 0 );
		cameraRight.animation.play( true, 0 );
		cameraLeft.animation.play( true, 0 );

		renderer.setClearColor( world.scene.fog.color );

	};

	this.hide = function () {



	};

	this.update = function ( f ) {

		time = new Date().getTime();
		delta = time - oldTime;
		oldTime = time;

		THREE.AnimationHandler.update( delta );

		soup.update( delta );

		// choose path
		var camz = camera.matrixWorld.n34;
	
		if (camz < -1000 && camz > -1030 && !switched ) {
			if (camera.theta < 1) {
				camera = cameraLeft;
			}
			if (camera.theta > 2) {
				camera = cameraRight;
			}
			//soup.camera = camera;
			console.log("switch");
			switched = true;
		}

		// slight camera roll
		/*if (camera.animationParent) {
			camera.animationParent.rotation.z = (camera.target.position.x)/700;
		}*/

		renderer.render( world.scene, camera, renderTarget );

		shared.logger.log( "vertices: " + renderer.data.vertices );
		shared.logger.log( 'faces: ' + renderer.data.faces );

	};

	function getParameterByName(name) {

		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);

		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));

	}


};

City.prototype = new SequencerItem();
City.prototype.constructor = City;
