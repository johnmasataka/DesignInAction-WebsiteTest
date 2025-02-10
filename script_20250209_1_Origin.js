import * as THREE from 'three';

document.getElementById('generate').addEventListener('click', () => {
    const prompt = document.getElementById('prompt').value;

    // 使用 text_parser.js 的解析器
    const parameters = parseTextToParameters(prompt);
    document.getElementById('parameters').textContent = JSON.stringify(parameters, null, 2);

    // 根据解析参数生成几何图形
    generateGeometry(parameters);
});

function generateGeometry(params) {
    // 清空现有的渲染场景
    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer.innerHTML = ''; // 清空之前的内容

    // 创建场景
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / 500, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(canvasContainer.clientWidth, 500);
    canvasContainer.appendChild(renderer.domElement);

    // 添加光源
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10).normalize();
    scene.add(light);

    // 根据参数生成房间几何
    const roomSize = params.size === 'large' ? 10 : 5; // 房间尺寸
    const rooms = params.rooms || 1;

    for (let i = 0; i < rooms; i++) {
        const geometry = new THREE.BoxGeometry(roomSize, 3, roomSize);
        const material = new THREE.MeshStandardMaterial({ color: params.material === 'wood' ? 0x8B4513 : 0xcccccc });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(i * (roomSize + 2), 0, 0); // 水平排列房间
        scene.add(cube);
    }

    // 设置摄像机位置
    camera.position.z = rooms * roomSize;

    // 渲染场景
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}
