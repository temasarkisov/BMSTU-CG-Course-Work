const pointLight1 = new THREE.PointLight( 0xffffff );
pointLight1.power = pointLight1.power * 3
pointLight1.position.set( 150, 10, 0 );
pointLight1.castShadow = false;
scene.add( pointLight1 );

const pointLight2 = new THREE.PointLight( 0xffffff );
pointLight2.power = pointLight2.power * 3
pointLight2.position.set( - 150, 0, 0 );
scene.add( pointLight2 );

const pointLight3 = new THREE.PointLight( 0xffffff );
pointLight3.power = pointLight3.power * 3
pointLight3.position.set( 0, - 10, - 150 );
scene.add( pointLight3 );

const pointLight4 = new THREE.PointLight( 0xffffff );
pointLight4.power = pointLight4.power * 3
pointLight4.position.set( 0, 0, 150 );
scene.add( pointLight4 );
