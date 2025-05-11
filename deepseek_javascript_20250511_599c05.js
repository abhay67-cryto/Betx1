// Game Variables
let scene, camera, renderer, plane, world, physicsPlane;
let speed = 0, altitude = 0, score = 0;
let obstacles = [];
let gameStarted = false;

// Initialize the game
function init() {
    // Three.js Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue

    // Camera (Perspective)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);

    // Renderer (WebGL)
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting (Realistic Sunlight)
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Physics (Cannon.js)
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0); // Earth gravity

    // Create the player's plane
    createPlane();

    // Generate terrain
    createTerrain();

    // Start button event
    document.getElementById('start-button').addEventListener('click', () => {
        document.getElementById('start-screen').style.display = 'none';
        gameStarted = true;
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Start game loop
    animate();
}

// Create the player's airplane
function createPlane() {
    // 3D Model (simplified for demo)
    const geometry = new THREE.BoxGeometry(3, 1, 4);
    const material = new THREE.MeshPhongMaterial({ color: 0x4682B4 });
    plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Physics body
    const planeShape = new CANNON.Box(new CANNON.Vec3(1.5, 0.5, 2));
    physicsPlane = new CANNON.Body({ mass: 1, shape: planeShape });
    physicsPlane.position.set(0, 10, 0);
    world.addBody(physicsPlane);
}

// Generate terrain (mountains, clouds)
function createTerrain() {
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x3a5f0b });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Clouds
    for (let i = 0; i < 20; i++) {
        const cloudGeometry = new THREE.SphereGeometry(2, 8, 8);
        const cloudMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloud.position.set(
            Math.random() * 200 - 100,
            Math.random() * 50 + 20,
            Math.random() * -500 - 100
        );
        scene.add(cloud);
    }
}

// Game loop
function animate() {
    requestAnimationFrame(animate);

    if (gameStarted) {
        // Update physics
        world.step(1/60);

        // Update plane position
        plane.position.copy(physicsPlane.position);
        plane.quaternion.copy(physicsPlane.quaternion);

        // Increase speed & altitude
        speed += 0.1;
        altitude = Math.max(0, plane.position.y * 10);

        // Update UI
        document.getElementById('speed').textContent = Math.floor(speed);
        document.getElementById('altitude').textContent = Math.floor(altitude);
        document.getElementById('score').textContent = Math.floor(speed * 0.5);

        // Generate obstacles
        if (Math.random() < 0.02) {
            createObstacle();
        }

        // Move camera behind the plane
        camera.position.set(plane.position.x - 5, plane.position.y + 3, plane.position.z + 10);
        camera.lookAt(plane.position);
    }

    renderer.render(scene, camera);
}

// Create obstacles (mountains, birds, etc.)
function createObstacle() {
    const obstacleGeometry = new THREE.ConeGeometry(5, 10, 8);
    const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.set(
        Math.random() * 100 - 50,
        0,
        plane.position.z - 200
    );
    scene.add(obstacle);
    obstacles.push(obstacle);
}

// Start the game
init();