// Import dependencies
// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';
// import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/controls/OrbitControls.js';
// import { OrbitControls } from './script/controls/OrbitControls.js';

import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import { parseTextToParameters } from './text.js';

document.getElementById('generate').addEventListener('click', () => {
    const userInput = document.getElementById('prompt').value;
    
    const parameters = parseTextToParameters(userInput);    // text.js > JSON

    generateCubeScene(parameters);    // Call function to generate a cube scene
});

// 3D
function generateCubeScene(parameters) {
    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer.innerHTML = '';
    // Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee); 

    const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000); //(75, canvasContainer.clientWidth / 500, 0.1, 1000);
    camera.position.set(15, 15, 15); 
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    canvasContainer.appendChild(renderer.domElement);

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(10, 20, 10);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Person
    const person = createPerson(1.8);
    person.position.set(0, 0, 7.5); 
    scene.add(person);

    const cube = createCube(parameters);
    cube.position.set(0, 5, 0);
    scene.add(cube);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.update();

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

function createPerson(height) {
    const bodyHeight = height * 0.83; 
    const headHeight = height * 0.17; 

    // body
    const bodyGeometry = new THREE.CylinderGeometry(0.55, 0.15, bodyHeight, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xA8A8A8 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = bodyHeight / 6; // Elevate to the ground.

    // head
    const headGeometry = new THREE.SphereGeometry(headHeight / 1, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xA8A8A8 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = bodyHeight; // Put it on top of the body.

    // Combine body and head into a group
    const person = new THREE.Group();
    person.add(body);
    person.add(head);

    return person;
}

// cube
function createCube(params) {
    // Extract parameters: length, width, height, and color
    const width = params.width || 10; // Default values
    const height = params.height || 10;
    const depth = params.depth || 10;
    const color = params.color || 0xA8A8A8; 

    // Create Cube Geometry and Materials
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), transparent: true, opacity: 0.75  });
    return new THREE.Mesh(geometry, material);
}





// Add event listener to the "Generate" button
// document.getElementById('generate').addEventListener('click', () => {
//     generateCubeScene();
// });

// function generateCubeScene() {
//     // empty canvas contents
//     const canvasContainer = document.getElementById('canvas-container');
//     canvasContainer.innerHTML = '';

//     //create scene, camera, renderer, and lights. 
//     const scene = createScene();

//     const camera = createCamera(canvasContainer);
//     scene.add(camera); // Adding a Camera to the Scene

//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(canvasContainer.clientWidth, 500);
//     canvasContainer.appendChild(renderer.domElement);

//     addLights(scene);

//     // object
//     const cube = createCube(10);
//     cube.position.set(0, 5, 0); // Lift the cube so that the bottom is on the ground
//     scene.add(cube);

//     // Human
//     const person = createPerson(1.8);
//     person.position.set(15, 0, 0); // 放置在立方体旁边
//     scene.add(person);

//     // OrbitControls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.update();

//     // render
//     function animate() {
//         requestAnimationFrame(animate);
//         controls.update();
//         renderer.render(scene, camera);
//     }
//     animate();
// }


// // Functions for creating scene, camera, lights, object, and human. 
// function createScene() {
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xeeeeee); 
//     return scene;
// }

// function createCamera(container) {
//     const camera = new THREE.PerspectiveCamera(75, container.clientWidth / 500, 0.1, 1000);
//     camera.position.set(25, 15, 25); // camera location
//     camera.lookAt(0, 0, 0); // focus on the center
//     return camera;
// }

// function addLights(scene) {
//     const light = new THREE.PointLight(0xffffff, 1);
//     light.position.set(10, 20, 10); // lighting location
//     scene.add(light);

//     const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // ambient light
//     scene.add(ambientLight);
// }

// function createCube(size) {
//     const geometry = new THREE.BoxGeometry(size, size, size);
//     const material = new THREE.MeshStandardMaterial({ color: 0xD5ACFF });
//     return new THREE.Mesh(geometry, material);
// }

// function createPerson(height) {
//     const bodyHeight = height * 0.83; 
//     const headHeight = height * 0.17; 

//     // body
//     const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, bodyHeight, 32);
//     const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
//     const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
//     body.position.y = bodyHeight / 2; // Elevate to the ground.

//     // head
//     const headGeometry = new THREE.SphereGeometry(headHeight / 2, 32, 32);
//     const headMaterial = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
//     const head = new THREE.Mesh(headGeometry, headMaterial);
//     head.position.y = bodyHeight + headHeight / 2; // Put it on top of the body.

//     // Combine body and head into a group
//     const person = new THREE.Group();
//     person.add(body);
//     person.add(head);

//     return person;
// }





