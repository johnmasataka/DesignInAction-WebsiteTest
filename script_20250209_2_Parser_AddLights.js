// Import dependencies
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';
import { parseTextToParameters } from './text_parser.js';
import { createWall, createFloor, createRoof } from './buildingComponents.js';

// Add event listener to the "Generate" button
document.getElementById('generate').addEventListener('click', () => {
    // Get user input from the textarea
    const prompt = document.getElementById('prompt').value;

    // Parse the text input into parameters using text_parser.js
    const parameters = parseTextToParameters(prompt);

    console.log("Parsed parameters:", parameters);

    document.getElementById('parameters').textContent = JSON.stringify(parameters, null, 2);

    // Generate 3D model based on the parsed parameters
    generateHouseScene(parameters);
});

// Function to generate the 3D scene
function generateHouseScene(params) {
    // Clear existing canvas content
    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer.innerHTML = '';

    // Set up Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee); // Set a light gray background

    const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / 500, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(canvasContainer.clientWidth, 500);
    canvasContainer.appendChild(renderer.domElement);

    // Add light to the scene
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(10, 20, 10);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Add ambient light
    scene.add(ambientLight);

    // Default parameters for fallback
    const defaults = {
        width: 10,
        depth: 10,
        height: 5,
        floorColor: 0xaaaaaa,
        wallColor: 0xffcc99,
        roofHeight: 3,
        roofColor: 0x8B0000,
        rooms: 1,
    };
    const finalParams = { ...defaults, ...params }; // Merge parsed parameters with defaults

    // Generate a floor
    const floor = createFloor(finalParams.width, finalParams.depth, finalParams.floorColor);
    scene.add(floor);

    // Generate walls
    for (let i = 0; i < finalParams.rooms; i++) {
        const roomOffset = i * (finalParams.width + 2);
        const wall1 = createWall(finalParams.width, finalParams.height, 0.2, finalParams.wallColor);
        wall1.position.set(roomOffset, finalParams.height / 2, -finalParams.depth / 2);
        scene.add(wall1);

        const wall2 = createWall(finalParams.width, finalParams.height, 0.2, finalParams.wallColor);
        wall2.position.set(roomOffset, finalParams.height / 2, finalParams.depth / 2);
        scene.add(wall2);

        const wall3 = createWall(finalParams.depth, finalParams.height, 0.2, finalParams.wallColor);
        wall3.rotation.y = Math.PI / 2;
        wall3.position.set(roomOffset - finalParams.width / 2, finalParams.height / 2, 0);
        scene.add(wall3);

        const wall4 = createWall(finalParams.depth, finalParams.height, 0.2, finalParams.wallColor);
        wall4.rotation.y = Math.PI / 2;
        wall4.position.set(roomOffset + finalParams.width / 2, finalParams.height / 2, 0);
        scene.add(wall4);
    }

    // Generate roof
    const roof = createRoof(finalParams.width, finalParams.depth, finalParams.roofHeight, finalParams.roofColor);
    roof.position.set(0, finalParams.height, 0);
    scene.add(roof);

    // Position the camera
    camera.position.set(finalParams.width * 1.5, finalParams.height * 2, finalParams.depth * 1.5);
    camera.lookAt(0, finalParams.height / 2, 0);

    // Render the scene
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}
