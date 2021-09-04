import { Component, OnInit } from '@angular/core';
// ThreeJS
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
})
export class ModelsComponent implements OnInit {


  constructor() { }

  ngOnInit() {
    let canvasEl = document.getElementById("artifactCanvas");
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight/2;
    canvasEl.style.width = String(canvasWidth);
    canvasEl.style.height = String(canvasHeight);


    let scene =	new THREE.Scene();
    let camera	= new THREE.PerspectiveCamera(
      75,	// Field of View
      canvasWidth/canvasHeight, // Aspect Ratio
      0.1,	// Near and far plane
      1000
    )

    // Setting the camera position
    // The smaller the value is the closer it is
    camera.position.z = 1;
    let renderer = new THREE.WebGLRenderer({canvas: canvasEl});

    renderer.setClearColor("#e5e5e5");	// Background color
    renderer.setSize(canvasWidth,canvasHeight);

    // Make the created canvas responsive
    window.addEventListener('resize', () => {
      renderer.setSize(canvasWidth,canvasHeight);
      camera.aspect = canvasWidth/canvasHeight;
      camera.updateProjectionMatrix();
    })


    let geometry = new THREE.SphereGeometry(1, 10, 10);
    let material = new THREE.MeshLambertMaterial({color: 0xFFCC00})
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 2;
    //scene.add(mesh);


    // Defining the loader object to load 3D Models
    let loader = new GLTFLoader();
    // We will save our GLTF scene into this object
    let obj;
    // Function defines what we do with the gltf information
    loader.load('../assets/3DModels/book/scene.gltf', function(gltf) {
    // We save it so we can rotate the object later
    obj = gltf.scene;
    // Get the scene information and add it to our scene
    scene.add(gltf.scene);
    });

    let light = new THREE.PointLight(0xFFFFFF,1,500);
    light.position.set(10,0,25);
    scene.add(light);

    let render = function () {
      requestAnimationFrame(render);
      //mesh.rotation.x += 0.01;
      obj.rotation.x += 0.01;
      obj.rotation.y += 0.01;
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
