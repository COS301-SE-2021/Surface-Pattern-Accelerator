import { Component, OnInit } from '@angular/core';
// ThreeJS
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
})
export class ModelsComponent implements OnInit {


  constructor() { }

  ngOnInit() {
    /*
    let mount = document.querySelector('#scene');
    let width = document.querySelector<HTMLDivElement>('#scene').offsetWidth;
    let height = document.querySelector<HTMLDivElement>('#scene').offsetHeight;

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(
      75, // Field of View
      width/height,	// Aspect Ratio
      0.1,	// Minimum distance
      1000  // Maximum distance
    );
    camera.position.z = 5;
    // Could be antialias : true
    let renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor("#e5e5e5");
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width,height);
    mount.appendChild(renderer.domElement);

    let geometry = new THREE.SphereGeometry(1, 10, 10);
    let material = new THREE.MeshLambertMaterial({color: 0xFFCC00});
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 2;
    scene.add(mesh);


    // Defining the loader object to load 3D Models
    //const loader = new GLTFLoader();
    // We will save our GLTF scene into this object
    //let obj;
    // Function defines what we do with the gltf information
    //loader.load('../assets/3DModels/iphone-x/scene.gltf', function(gltf) {
      // We save it so we can rotate the object later
      //obj = gltf.scene;
      // Get the scene information and add it to our scene
      //scene.add(gltf.scene);
    //});


    //let light = new THREE.HemisphereLight(0xffffff, 0x000000, 10);
    //scene.add(light);
    // Set the color, intensity and distance
    let light = new THREE.PointLight(0xFFFFFF,1,500);
    light.position.set(10,0,25);
    scene.add(light);

    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.01;
      renderer.render(scene, camera);
    }
    animate();
     */
    let scene =	new THREE.Scene();
    let camera	= new THREE.PerspectiveCamera(
      75,	// Field of View
      window.innerWidth/window.innerHeight,	// Aspect Ratio
      0.1,	// Near and far plane
      300
    )
    // Setting the camera position
    camera.position.z = 1;
    let renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor("#e5e5e5");	// Background color
    renderer.setSize(window.innerWidth,window.innerHeight);

    // Create canvas element with our renderer settings
    document.body.appendChild(renderer.domElement);
    // Make the created canvas responsive
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth,window.innerHeight);
      // We need to re-adjust the camera 'aspect ratio'
      camera.aspect = window.innerWidth/window.innerHeight;
      // Needs to be called after an adjustment is made
      camera.updateProjectionMatrix();
    })

    // Defining a native 3D object
    // Shape and Form of object
    let geometry = new THREE.SphereGeometry(1, 10, 10);
    // Material of Object
    // Color of object is also defined here
    // MeshLambertMaterial is a material for non-shiny surfaces, without spectacular highlights
    let material = new THREE.MeshLambertMaterial({color: 0xFFCC00})
    //We need to combine the geometry and material into was called a mesh
    let mesh = new THREE.Mesh(geometry, material);
    // To be able to move around an object in space
    mesh.position.x = 2;
    //Add the mesh to the scene
    //scene.add(mesh);

    // Defining the loader object to load 3D Models
    let loader = new GLTFLoader();
    // We will save our GLTF scene into this object
    let obj;
    // Function defines what we do with the gltf information
    loader.load('../assets/3DModels/mug-cup/scene.gltf', function(gltf) {
    // We save it so we can rotate the object later
    obj = gltf.scene;
    // Get the scene information and add it to our scene
    scene.add(gltf.scene);
    });


    // Define the light
    // Set the color, intensity and distance
    let light = new THREE.PointLight(0xFFFFFF,1,500);
    light.position.set(10,0,25);
    scene.add(light);
    // Keeps the aspect ratio constant
    // Br causing the renderer to redraw the screen everytime it is refreshed
    let render = function () {
      requestAnimationFrame(render);
      // Rotates the object on the x-axis everytime the renderer function is called
      // which is essentially 60 frames per second
      mesh.rotation.x += 0.01;
      obj.rotation.x += 0.01;
      // We have to call the renderer method on the renderer
      renderer.render(scene, camera);
    }

    render();
  }


  openTab($event: MouseEvent, tabPage: string) {
    let i, tabContent;
    tabContent  = document.getElementsByClassName('tab-content');
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = 'none';
    }
    document.getElementById(tabPage).style.display  = 'block';
  }

}
