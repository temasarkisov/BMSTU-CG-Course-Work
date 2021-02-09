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