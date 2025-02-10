import * as THREE from 'three';

// Create wall
function createWall(width, height, depth, color) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ color });
    const wall = new THREE.Mesh(geometry, material);
    return wall;
}

// Create floor
function createFloor(width, depth, color) {
    const geometry = new THREE.PlaneGeometry(width, depth);
    const material = new THREE.MeshStandardMaterial({ color });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2; // Rotate to horizontal
    return floor;
}

// Create roof
function createRoof(width, depth, height, color) {
    const geometry = new THREE.ConeGeometry(Math.sqrt(width ** 2 + depth ** 2) / 2, height, 4);
    const material = new THREE.MeshStandardMaterial({ color });
    const roof = new THREE.Mesh(geometry, material);
    roof.rotation.y = Math.PI / 4; // Adjust for square roof
    return roof;
}

export { createWall, createFloor, createRoof };
