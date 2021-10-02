// Global Variables
let scene;
let renderer;
let material;
let loader;
let obj;
let camera;
let urlValue;
let texture;
let render;
let controls;

function main(stringModel) {

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  // larger the number the further away it is
  camera.position.z = 80; // Setting the camera position
  camera.position.y = 0;
  camera.position.x = 110;

  // Renderer
  renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Light
  const light = new THREE.AmbientLight(0xFFFFFF); // soft white light
  light.position.set(10, 0, 25);
  scene.add(light);


  //Get file name the user wants to render
  let fileName = prompt("Please enter your file name");
  let responseObj;
  new Promise((success, failure) => {

    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('GET', 'http://localhost:3000/threeDViewer/' + fileName);
    xhr.send()
    xhr.onreadystatechange = () => {
      console.log("fetched")
      responseObj = xhr.response;
      //console.log(responseObj)
      success(responseObj)
    }
  }).then(dataURI => {
    // Texture

    setTimeout(() => {
      console.log(responseObj)
      texture = new THREE.TextureLoader().load(responseObj)
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set( 4, 4 );

      // Object Loader
      if (stringModel === 'shirt') {
        urlValue = '../ObjectModels/t+shirts.obj';
      }
      else if (stringModel === 'cat') {
        urlValue = '../ObjectModels/cat.obj';
      }

      loader = new THREE.OBJLoader();
      loader.load(
          urlValue,
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
            console.log( 'An error occurred' );
            console.log( error);
          }
      );



// Animation
      render = function () {
        requestAnimationFrame(render);
        if (obj != null) {
          obj.rotation.y += 0.01;
        }
        controls.update();
        renderer.render(scene, camera);
      }
      render();
    },2000)



  })




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

function loadObject(stringM) {
  let stringV;
  if (stringM === 'cat') {
    scene.remove(obj);
    stringV = '../ObjectModels/cat.obj';
    camera.position.z = 3; // Setting the camera position
    camera.position.y = 0;
    camera.position.x = 0;
  } else if (stringM === 'shirt')
  {
    scene.remove(obj);
    stringV = '../ObjectModels/t+shirts.obj';
    camera.position.z = 80; // Setting the camera position
    camera.position.y = 0;
    camera.position.x = 110;
  } else if (stringM === 'pillow')
  {
    scene.remove(obj);
    stringV = '../ObjectModels/Pillow.obj';
    camera.position.x = 270;
    camera.position.z = 100;
  }else if (stringM === 'mug')
  {
    scene.remove(obj);
    stringV = '../ObjectModels/mug.obj';
    camera.position.z = 80; // Setting the camera position
    camera.position.y = 0;
    camera.position.x = 110;
  }

  loader.load(
    stringV,
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
}

function stopAnimation() {
  //canvasPicture-46c5canvasPicture.png
  // Animation
  render = function () {
    requestAnimationFrame(render);
    if (obj != null) {
      obj.rotation.y += 0.00;
    }
    controls.update();
    renderer.render(scene, camera);
  }
  render();
}

function startAnimation() {
  // Animation
  render = function () {
    requestAnimationFrame(render);
    if (obj != null) {
      obj.rotation.y += 0.001;
    }
    controls.update();
    renderer.render(scene, camera);
  }
  render();
}
