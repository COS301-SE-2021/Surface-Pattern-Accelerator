// Global Variables
let scene;
let renderer;
let material;
let loader;
let obj;
let camera;

function main() {

// Scene
  scene = new THREE.Scene();

// Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  // larger the number the further away it is
  camera.position.z = 100; // Setting the camera position

// Renderer
  //renderer = new THREE.WebGLRenderer({canvas: canvasEl, alpha: true});
  //renderer.setSize(canvasWidth, canvasHeight, false);
  renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

// Controls
  let controls = new THREE.OrbitControls(camera, renderer.domElement);

// Texture
  let texture = new THREE.TextureLoader().load('https://image.freepik.com/free-vector/topical-palm-leaves-seamless-pattern-fabric-texture-vector-illustration_1182-1327.jpg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 4, 4 );

  // Object Loader
  loader = new THREE.OBJLoader();
  loader.load(
    '../ObjectModels/t+shirts.obj',
    function ( object ) {
      obj = object;

      object.traverse( function ( child ) {
        if ( child.isMesh ) {
          child.material.map = texture; // assign your diffuse texture here
        }
      } );

      scene.add( object );
    },
    // called when loading is in progresses
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
      console.log( 'An error happened' );
      console.log( error);
    }
  );

// Light
  const light = new THREE.AmbientLight(0xFFFFFF); // soft white light
  light.position.set(10, 0, 25);
  scene.add(light);

// Animation
  let render = function () {
    requestAnimationFrame(render);
    obj.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
  }
  render();
}

// Make the created canvas responsive
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
})

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

        let newTexture = new THREE.TextureLoader().load(image);
        obj.traverse( function ( child ) {
          if ( child.isMesh ) {
            child.material.map = newTexture; // assign your diffuse texture here
          }
        } );

        scene.add( object );
      } catch (err) {
        // For debugging purposes
        console.log(err.message);
      }
    }
  });


}
