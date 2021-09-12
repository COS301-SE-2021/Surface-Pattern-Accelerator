let canvasWidth = window.innerWidth;
let canvasHeight = 250;

let scene =	new THREE.Scene(); 
		
// Camera
let camera	= new THREE.PerspectiveCamera(75,	canvasWidth/canvasHeight,0.1, 1000);
camera.position.z = 5; // Setting the camera position

let canvasEl = document.getElementById("artifactCanvas");

// Renderer
let renderer = new THREE.WebGLRenderer({canvas: canvasEl});
renderer.setClearColor("#e5e5e5");	// Background color
renderer.setSize(canvasWidth,canvasHeight);

// Controls
let controls = new THREE.OrbitControls( camera, renderer.domElement );

// Make the created canvas responsive
window.addEventListener('resize', () => {
	renderer.setSize(canvasWidth,canvasHeight);
	camera.aspect = canvasWidth/canvasHeight;
	camera.updateProjectionMatrix();
})

// Defining a native 3D object
// Shape and Form of object
let geometry = new THREE.SphereGeometry(1, 10, 10); 

// Texture
let texture = new THREE.TextureLoader().load('wonderland.jpg');
let material = new THREE.MeshLambertMaterial({ map: texture }); // {color: 0xFFCC00}

let mesh = new THREE.Mesh(geometry, material);
mesh.position.x = 2;
scene.add(mesh);
		
let light = new THREE.PointLight(0xFFFFFF,1,500);
light.position.set(10,0,25);
scene.add(light);
		
let render = function () {
	requestAnimationFrame(render);
	mesh.rotation.x += 0.01;
	controls.update();
	renderer.render(scene, camera);
}
		
render();