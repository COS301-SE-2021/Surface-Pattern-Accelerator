// Global Variables
let scene;
let renderer;
let material;

function main() {
// Canvas Attribute Values
  let canvasWidth = 0.99 * window.innerWidth;
  let canvasHeight = 0.85 * window.innerHeight;

// Scene
  scene = new THREE.Scene();

// Camera
  let camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
  camera.position.z = 5; // Setting the camera position

// Canvas
  let canvasEl = document.getElementById("artifactCanvas");

// Renderer
  renderer = new THREE.WebGLRenderer({canvas: canvasEl, alpha: true});
  renderer.setSize(canvasWidth, canvasHeight, false);

// Controls
  let controls = new THREE.OrbitControls(camera, renderer.domElement);

// Make the created canvas responsive
  window.addEventListener('resize', () => {
    renderer.setSize(canvasWidth, canvasHeight);
    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();
  })

// Defining a native 3D object
// Shape and Form of object
  let geometry = new THREE.SphereGeometry(1, 10, 10);

// Texture
  let texture = new THREE.TextureLoader().load('https://thumbs.dreamstime.com/z/vector-tropical-pattern-palms-hibiscus-amazing-intricate-botanical-black-dark-colors-fashion-print-78719904.jpg');
  material = new THREE.MeshLambertMaterial({map: texture}); // {color: 0xFFCC00}

// Mesh
  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = 2;
  scene.add(mesh);

// Light
  const light = new THREE.AmbientLight(0xFFFFFF); // soft white light
  light.position.set(10, 0, 25);
  scene.add(light);

// Animation
  let render = function () {
    requestAnimationFrame(render);
    mesh.rotation.x += 0.01;
    controls.update();
    renderer.render(scene, camera);
  }
  render();
}

function loadImage() {
  const imageInput = document.getElementById('upload-file');
  // Trigger the hidden input type='file' html element
  imageInput.click();
  // Activates when a user selects a file and a change event is fired by the browser
  imageInput.addEventListener('change', ()=> {
    const file = imageInput.files[0];
    // Check for file
    if (file) {
      try {
        // Loads the uploaded file to the html src attribute
        let image = URL.createObjectURL(file);
        material.map = new THREE.TextureLoader().load(image);
      } catch (err) {
        // For debugging purposes
        console.log(err.message);
      }
    }
  });


}
