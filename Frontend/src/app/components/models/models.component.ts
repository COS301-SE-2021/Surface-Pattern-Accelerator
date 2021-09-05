import { Component, OnInit } from '@angular/core';
// THREEJS
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
})


export class ModelsComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // Canvas
    let canvasEl = document.getElementById("artifactCanvas");

    // Aspect Ratio
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight/2;
    canvasEl.style.width = String(canvasWidth);
    canvasEl.style.height = String(canvasHeight);

    // Scene
    let scene =	new THREE.Scene();

    // Camera
    let camera	= new THREE.PerspectiveCamera(75,canvasWidth/canvasHeight,0.1, 1000)
    camera.position.z = 1; // The smaller the value is, the closer to the model

    // Renderer
    let renderer = new THREE.WebGLRenderer({canvas: canvasEl});
    renderer.setClearColor("#e5e5e5");	// Background color
    renderer.setSize(canvasWidth,canvasHeight);

    // Responsiveness
    window.addEventListener('resize', () => {
      renderer.setSize(canvasWidth,canvasHeight);
      camera.aspect = canvasWidth/canvasHeight;
      camera.updateProjectionMatrix();
    })

    // Define 3D MODEL
    let geometry = new THREE.SphereGeometry(1, 10, 10);
    let material = new THREE.MeshLambertMaterial({color: 0xFFCC00})
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 2;
    //scene.add(mesh);


    // Load 3D MODEL
    let loader = new GLTFLoader();
    let obj;
    loader.load('../assets/3DModels/book/scene.gltf', function(gltf) {
    obj = gltf.scene;
    scene.add(gltf.scene);
    });

    // Light
    let light = new THREE.PointLight(0xFFFFFF,1,500);
    light.position.set(10,0,25);
    scene.add(light);

    // Animation
    let render = function () {
      requestAnimationFrame(render);
      //mesh.rotation.x += 0.01;
      if (obj != null) {
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.01;
      }
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

  applyPattern() {

  }


}
