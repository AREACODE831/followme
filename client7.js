// Art 109 Three.js Demo Site
// client7.js
// A three.js scene which uses planes and texture loading to generate a scene with images which can be traversed with basic WASD and mouse controls, this scene is full screen with an overlay.

// Import required source code
// Import three.js core
import * as THREE from "./build/three.module.js";
// Import pointer lock controls
import {  PointerLockControls} from "./src/PointerLockControls.js";


import { FirstPersonControls } from "./src/FirstPersonControls.js";
import { GLTFLoader } from "./src/GLTFLoader.js";
import { FontLoader } from "./src/FontLoader.js";
import { TextGeometry } from "./src/TextGeometry.js";


import { GUI } from "./src/dat.gui.module.js";

import { MapControls } from "./src/OrbitControls.js";

import { DRACOLoader } from "./src/DRACOLoader.js";



let mixer;

const clock = new THREE.Clock();
const container = document.getElementById( 'container' );

const stats = new Stats();
container.appendChild( stats.dom );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild( renderer.domElement );

const pmremGenerator = new THREE.PMREMGenerator( renderer );

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xbfe3dd );
scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
camera.position.set( 5, 2, 8 );

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( 'src/' );

const loader = new GLTFLoader();
loader.setDRACOLoader( dracoLoader );
loader.load( './assets/hiphop.glb', function ( gltf ) {

  const model = gltf.scene;
  model.position.set( 1, 1, 0 );
  model.scale.set( 10, 10, 10 );
  scene.add( model );

  mixer = new THREE.AnimationMixer( model );
  mixer.clipAction( gltf.animations[ 0 ] ).play();

  animate();

}, undefined, function ( e ) {

  console.error( e );

} );


window.onresize = function () {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

};


function animate() {

  requestAnimationFrame( animate );

  const delta = clock.getDelta();

  mixer.update( delta );

  controls.update();

  stats.update();

  renderer.render( scene, camera );

}
