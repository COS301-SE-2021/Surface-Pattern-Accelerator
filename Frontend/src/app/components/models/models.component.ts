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
    let mount = document.querySelector('#scene');
    let width = document.querySelector<HTMLDivElement>('#scene').offsetWidth;
    let height = document.querySelector<HTMLDivElement>('#scene').offsetHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, // Field of View
      width/height,	// Aspect Ratio
      0.1,	// Minimum distance
      1000  // Maximum distance
    );
    camera.position.z = 5;
    // Could be antialias : true
    let renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setClearColor("#e5e5e5");
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width,height);
    mount.appendChild(renderer.domElement);

    let geometry = new THREE.SphereGeometry(1, 10, 10);
    let material = new THREE.MeshLambertMaterial({color: 0xFFCC00});
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 2;
    scene.add(mesh);

    /*
    // Defining the loader object to load 3D Models
    const loader = new GLTFLoader();
    // We will save our GLTF scene into this object
    let obj;
    // Function defines what we do with the gltf information
    loader.load('../assets/3DModels/iphone-x/scene.gltf', function(gltf) {
      // We save it so we can rotate the object later
      obj = gltf.scene;
      // Get the scene information and add it to our scene
      scene.add(gltf.scene);
    });
     */

    //scene.background  = new THREE.color('#e5e5e5');
    let light = new THREE.HemisphereLight(0xffffff, 0x000000, 10);
    scene.add(light);

    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.01;
      renderer.render(scene, camera);
    }
    animate();
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
