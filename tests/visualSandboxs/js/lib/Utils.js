function preInitModel( geometry, renderer, scene, object ) {
	
	// pre-initialize buffers

	renderer.initWebGLObjects( scene );

	// this makes videos black

	// pre-initialize shaders

	var i, material;
	
	for( i = 0; i < geometry.materials.length; i++ ) {

		material = geometry.materials[ i ][ 0 ];

		if ( ! ( material instanceof THREE.MeshFaceMaterial ) ) {

			if( !material.program ) {

				//renderer.initMaterial( material, scene.lights, scene.fog, object );
				
			}

		}

	}


};

function initLensFlares( where, position, sx, sy ) {

	var texture0 = THREE.ImageUtils.loadTexture( "files/textures/lensflare0.png" );
	var texture1 = THREE.ImageUtils.loadTexture( "files/textures/lensflare2.png" );
	var texture2 = THREE.ImageUtils.loadTexture( "files/textures/lensflare3.png" );
	
	where.lensFlare = new THREE.LensFlare( texture0, 700, 0.0, THREE.AdditiveBlending );

	where.lensFlare.add( texture1, 512, 0.0, THREE.AdditiveBlending );
	where.lensFlare.add( texture1, 512, 0.0, THREE.AdditiveBlending );
	where.lensFlare.add( texture1, 512, 0.0, THREE.AdditiveBlending );

	where.lensFlare.add( texture2,  60, 0.6, THREE.AdditiveBlending );
	where.lensFlare.add( texture2,  70, 0.7, THREE.AdditiveBlending );
	where.lensFlare.add( texture2, 120, 0.9, THREE.AdditiveBlending );
	where.lensFlare.add( texture2,  70, 1.0, THREE.AdditiveBlending );

	where.lensFlare.customUpdateCallback = lensFlareUpdateCallback;
	where.lensFlare.position.copy( position );

	
	where.lensFlareRotate = new THREE.Object3D();
	
	where.lensFlareRotate.addChild( where.lensFlare );

	var alwaysThere = new THREE.Sprite( { map: texture0, blending: THREE.AdditiveBlending, useScreenCoordinates: false, mergeWith3D: true, affectedByDistance: false } );
	alwaysThere.position.copy( position );
	alwaysThere.rotation = -1.2;
	alwaysThere.opacity = 0.2;
	alwaysThere.scale.set( 0.75, 0.75, 1.0 );
	where.lensFlareRotate.addChild( alwaysThere );

	var alwaysThere = new THREE.Sprite( { map: texture0, blending: THREE.AdditiveBlending, useScreenCoordinates: false, mergeWith3D: false, affectedByDistance: false } );
	alwaysThere.position.copy( position );
	alwaysThere.rotation = 1.2;
	alwaysThere.opacity = 0.1;
	alwaysThere.scale.set( 1.5, 1.5, 1.0 );
	where.lensFlareRotate.addChild( alwaysThere );


	where.lensFlareRotate.rotation.x = sx * Math.PI / 180;
	where.lensFlareRotate.rotation.y = sy * Math.PI / 180;

	where.scene.addChild( where.lensFlareRotate );

};


function lensFlareUpdateCallback( object ) {

	var flare, f, fl = object.lensFlares.length;
	var vecX = -object.positionScreen.x * 2;
	var vecY = -object.positionScreen.y * 2; 

	for( f = 0; f < fl; f++ ) {
   
		flare = object.lensFlares[ f ];
   
		flare.x = object.positionScreen.x + vecX * flare.distance;
		flare.y = object.positionScreen.y + vecY * flare.distance;

		flare.rotation = 0;

	}

	// hard coded stuff

	object.lensFlares[ 2 ].y += 0.025;
	object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + 45 * Math.PI / 180;

};

function makeSceneStatic( scene ) {

	var i, l, object;
	
	for ( i = 0, l = scene.objects.length; i < l; i ++ ) {

		object = scene.objects[ i ];
		object.matrixAutoUpdate = false;
		object.updateMatrix();

	}

};

function hideColliders( scene ) {
	
	var i, l, mesh;

	for( i = 0, l = scene.collisions.colliders.length; i < l; i++ ) {

		mesh = scene.collisions.colliders[ i ].mesh;
		mesh.visible = false;
	}

};