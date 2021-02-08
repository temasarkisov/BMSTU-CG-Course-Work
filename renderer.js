import * as THREE from './node_modules/three/build/three.module.js';
import Stats from './node_modules/three/examples/jsm/libs/stats.module.js';
import { GUI } from './node_modules/three/examples/jsm/libs/dat.gui.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';  
import { OBJLoader } from './node_modules/three/examples/jsm/loaders/OBJLoader.js'; 
import { RGBELoader } from './node_modules/three/examples/jsm/loaders/RGBELoader.js';

let container, stats;
const params = {
    projection: 'normal',
    autoRotate: false,
    background: false,
    position: 'front',
    gemColor: 'White',
    gemCut: 'Talla Brillante',
    lightMode: 'on'
};

let camera, scene, renderer;
let gemBackMaterial, gemFrontMaterial;
let lightMode;
let gemCut;
let cameraPosition;
let hdrCubeRenderTarget;
let cameraBreakValue = 0

let objects = [];

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(70, 0, 0);
    cameraPosition = 'front'

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    renderer = new THREE.WebGLRenderer({antialias: true});

    gemBackMaterial = new THREE.MeshPhysicalMaterial({
        map: null,
        color: 0x888888,
        metalness: 1,
        roughness: 0,
        opacity: 0.5,
        side: THREE.BackSide,
        transparent: true,
        envMapIntensity: 5,
        premultipliedAlpha: true
    });

    gemFrontMaterial = new THREE.MeshPhysicalMaterial({
        map: null,
        color: 0x0000ff,
        metalness: 0,
        roughness: 0,
        opacity: 0.25,
        side: THREE.FrontSide,
        transparent: true,
        envMapIntensity: 10,
        premultipliedAlpha: true
    });

    gemCut = 'Talla Brillante'

    const manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    let loader = new OBJLoader(manager);
    loader.load('models/talla_brillante.obj', function (object) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = gemBackMaterial;
                const second = child.clone();
                second.material = gemFrontMaterial;

                const parent = new THREE.Group();
                parent.add(second);
                parent.add(child);
                parent.name = "gemModel"
                scene.add(parent);

                objects.push(parent);
            }
        });
    });

    lightMode = 'on'

    new RGBELoader().setDataType( THREE.UnsignedByteType ).setPath('textures/').load('lights_on.hdr', function (hdrEquirect) {
        hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(hdrEquirect);
        pmremGenerator.dispose();

        gemFrontMaterial.envMap = gemBackMaterial.envMap = hdrCubeRenderTarget.texture;
        gemFrontMaterial.needsUpdate = gemBackMaterial.needsUpdate = true;

        hdrEquirect.dispose();
    } );

    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    // Lights

    scene.add( new THREE.AmbientLight( 0x222222 ) );

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

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );

    renderer.outputEncoding = THREE.sRGBEncoding;

    stats = new Stats();
    // container.appendChild( stats.dom );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 20;
    controls.maxDistance = 200;

    window.addEventListener('resize', onWindowResize);

    const gui = new GUI();

    gui.add( params, 'position', [ 'front', 'top' ] );
    gui.add( params, 'lightMode', [ 'on', 'off' ] );
    gui.add( params, 'autoRotate' );
    gui.add( params, 'gemColor', [ 'Blue', 'Green', 'Red', 'White', 'Black', 'Lil Uzi Pink'] );
    gui.add( params, 'gemCut', [ 'Talla Brillante', 'Talla Esmeralda', 'Talla Perruzi', 'Talla Heart','Lil Uzi Diamod'] );
    gui.open();
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );
}

function animate() {
    requestAnimationFrame(animate);

    stats.begin();
    render()
    stats.end();
}

function render() {
    
    if (gemBackMaterial !== undefined && gemFrontMaterial !== undefined) {

        gemFrontMaterial.reflectivity = gemBackMaterial.reflectivity = 1;

        let newColor = gemBackMaterial.color;
        switch (params.gemColor) {
            case 'Blue': newColor = new THREE.Color( 0x000088 ); break;
            case 'Red': newColor = new THREE.Color( 0x880000 ); break;
            case 'Green': newColor = new THREE.Color( 0x008800 ); break;
            case 'White': newColor = new THREE.Color( 0x888888 ); break;
            case 'Black': newColor = new THREE.Color( 0x0f0f0f ); break;
            case 'Lil Uzi Pink': newColor = new THREE.Color( 0xffabed ); break;
        }

        gemBackMaterial.color = gemFrontMaterial.color = newColor;

        const manager = new THREE.LoadingManager();
            manager.onProgress = function (item, loaded, total) {
                console.log(item, loaded, total);
            };

            let loader = new OBJLoader(manager);

        if (params.lightMode != lightMode) {
            switch (params.position) {
                case 'on': 
                    new RGBELoader().setDataType( THREE.UnsignedByteType ).setPath('textures/').load('lights_on.hdr', function (hdrEquirect) {
                        hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(hdrEquirect);
                        pmremGenerator.dispose();
                
                        gemFrontMaterial.envMap = gemBackMaterial.envMap = hdrCubeRenderTarget.texture;
                        gemFrontMaterial.needsUpdate = gemBackMaterial.needsUpdate = true;
            
                        hdrEquirect.dispose();
                    } ); break;

                case 'off': 
                    new RGBELoader().setDataType( THREE.UnsignedByteType ).setPath('textures/').load('lights_off.hdr', function (hdrEquirect) {
                        hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(hdrEquirect);
                        pmremGenerator.dispose();
                
                        gemFrontMaterial.envMap = gemBackMaterial.envMap = hdrCubeRenderTarget.texture;
                        gemFrontMaterial.needsUpdate = gemBackMaterial.needsUpdate = true;
            
                        hdrEquirect.dispose();
                    } ); break;
            }
            
            lightMode = params.lightMode

            const pmremGenerator = new THREE.PMREMGenerator( renderer );
            pmremGenerator.compileEquirectangularShader();
        }

        if (params.gemCut != gemCut) {
            var selectedObject = scene.getObjectByName("gemModel");
            scene.remove(selectedObject);
            objects = []

            switch (params.gemCut) {
                case 'Talla Brillante': 
                    loader.load('models/talla_brillante.obj', function (object) {
                        object.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {
                                child.material = gemBackMaterial;
                                const second = child.clone();
                                second.material = gemFrontMaterial;
        
                                const parent = new THREE.Group();
                                parent.add(second);
                                parent.add(child);
                                parent.name = "gemModel"
                                scene.add(parent);
        
                                objects.push(parent);
                            }
                        });
                    }); break;

                case 'Talla Esmeralda': console.log(params.gemCut); 
                    loader.load('models/talla_esmeralda.obj', function (object) {
                        object.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {
                                child.material = gemBackMaterial;
                                const second = child.clone();
                                second.material = gemFrontMaterial;
        
                                const parent = new THREE.Group();
                                parent.add(second);
                                parent.add(child);
                                parent.name = "gemModel"
                                scene.add(parent);
        
                                objects.push(parent);
                            }
                        });
                    }); break;

                case 'Lil Uzi Diamod': console.log(params.gemCut); 
                    loader.load('models/lil_uzi_diamond.obj', function (object) {
                        object.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {
                                child.material = gemBackMaterial;
                                const second = child.clone();
                                second.material = gemFrontMaterial;
        
                                const parent = new THREE.Group();
                                parent.add(second);
                                parent.add(child);
                                parent.name = "gemModel"
                                scene.add(parent);
        
                                objects.push(parent);
                            }
                        });
                    }); break;

                case 'Talla Perruzi': console.log(params.gemCut); 
                    loader.load('models/talla_perruzi.obj', function (object) {
                        object.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {
                                child.material = gemBackMaterial;
                                const second = child.clone();
                                second.material = gemFrontMaterial;
        
                                const parent = new THREE.Group();
                                parent.add(second);
                                parent.add(child);
                                parent.name = "gemModel"
                                scene.add(parent);
        
                                objects.push(parent);
                            }
                        });
                    }); break;

                case 'Talla Heart': console.log(params.gemCut); 
                    loader.load('models/talla_heart.obj', function (object) {
                        object.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {
                                child.material = gemBackMaterial;
                                const second = child.clone();
                                second.material = gemFrontMaterial;
        
                                const parent = new THREE.Group();
                                parent.add(second);
                                parent.add(child);
                                parent.name = "gemModel"
                                scene.add(parent);
        
                                objects.push(parent);
                            }
                        });
                    }); break;
            }

            gemCut = params.gemCut
            cameraBreakValue = 0
        }
        
        if (params.position != cameraPosition) {
            switch (params.position) {
                case 'front': camera.position.set(70, 0, 0); break;
                case 'top': camera.position.set(0, 70, 0); break; 
            }

            cameraPosition = params.position
        }
    }

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

    renderer.render( scene, camera );
}

init();
animate();