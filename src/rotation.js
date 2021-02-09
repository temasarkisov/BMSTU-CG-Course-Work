renderer.toneMappingExposure = 1.0;
camera.lookAt( scene.position );

if ( params.autoRotate ) {
    for ( let i = 0, l = objects.length; i < l; i ++ ) {
        const object = objects[ i ];
        if (cameraBreakValue === 30) {
            object.rotation.y += 0.1;
            cameraBreakValue = 0
        }
    }
    cameraBreakValue += 1
}

if ( !params.autoRotate ) {
    cameraBreakValue = 0
}

renderer.render( scene, camera )