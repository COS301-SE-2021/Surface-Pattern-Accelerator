import { Component, OnInit } from '@angular/core';
//import * as express from 'express';
//import * as path from 'path';
// THREE JS
import * as THREE from 'three';
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
})


export class ModelsComponent implements OnInit {

  //scene : THREE.Scene;
  //camera : THREE.PerspectiveCamera;

  constructor() {}

  ngOnInit() {

    //window.location.href = 'external/MODEL/index.html';

    /*
    const expressM  = require('express');
    const appM  = express();
    const path  = require('path');
    const routerM = expressM.Router();

    router.get('/',function(req,res){
      res.sendFile(path.join(__dirname+'/index.html'));
      //__dirname : It will resolve to your project folder.
    });

    //add the router
    appM.use('/', routerM);
    appM.listen(process.env.port || 3100);

    console.log('Running at Port 3100');


  /*
    // Canvas
    let canvasEl = document.getElementById("artifactCanvas");

    // Aspect Ratio
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight/2;
    canvasEl.style.width = String(canvasWidth);
    canvasEl.style.height = String(canvasHeight);

    // Scene
    let scene =	new THREE.Scene();
    this.scene = scene; // For use in a separate function

    // Camera
    let camera	= new THREE.PerspectiveCamera(75,canvasWidth/canvasHeight,0.1, 1000);
    this.camera = camera; // For use in a separate function
    camera.position.z = 1; // The smaller the value is, the closer to the model

    // Renderer
    let renderer = new THREE.WebGLRenderer({canvas: canvasEl});
    renderer.setClearColor("#e5e5e5");	// Background color
    renderer.setSize(canvasWidth,canvasHeight);

    // Controls
    //let controls = new THREE.OrbitControls( camera, renderer.domElement );

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
    loader.load('../assets/3DModels/book/scene.gltf', async function (gltf) {
      obj = gltf.scene;

      // Texture
      const textureLoader = new THREE.TextureLoader();
      //let texturePath = '../assets/wonderland.jpg';
      let texturePath = '../assets/launch.jpg';
      let texture = await textureLoader.loadAsync(texturePath);
      texture.flipY = false;

      // Update model
      obj.traverse((o) => {
        if (o.isMesh) {
          o.material.map = texture;
          o.material.needsUpdate = true;
        }
      });

      //scene.add(gltf.scene);
      scene.add(obj);
    });

    // Light
    let light = new THREE.PointLight(0xFFFFFF,1,500);
    light.position.set(10,0,25);
    this.scene.add(light);

    // Animation
    let render = function () {
      requestAnimationFrame(render);
      //mesh.rotation.x += 0.01;
      if (obj != null) {
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.01;
      }
      //controls.update()
      renderer.render(scene, camera);
    }

    render();
   */
  }

/*
  openTab($event: MouseEvent, tabPage: string) {
    let i, tabContent;
    tabContent  = document.getElementsByClassName('tab-content');
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = 'none';
    }
    document.getElementById(tabPage).style.display  = 'block';
  }

   */
}
