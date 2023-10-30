import * as THREE from "three";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

import Experience from "../Experience";
import World from "./World";
import Theme from "../Theme";

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.room = this.resources.items.room;
    this.roomModel = this.room.scene;
    
    this.roomChildren = {};

    this.lerp = {
      current: 0,
      target: 0,
      ease: 1,
    };

    this.setModel();
    this.onMouseMove();
  }

  setModel() {
    this.roomModel.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child instanceof THREE.Group) {
        child.children.forEach((groupChild) => {
          groupChild.castShadow = true;
          groupChild.receiveShadow = true;
        });
      }

      // reset default
      if (child.name === "DecoExt") {
        child.position.y -= 0.1;
        
      }
      

      if (child.name === "MiniFloor") {
        child.position.x = -0.127146;
        child.position.z = 1.89073;

       

        
        
      }

      if (child.name === "Computers") {
        child.children[1].material = new THREE.MeshBasicMaterial({
            map: this.resources.items.screen,
        });

        const width = 0.9;
        const height = 0.3;
        const intensity = 2;
        const rectLight = new THREE.RectAreaLight(
            0xffffff,
            intensity,
            width,
            height,
        );
        rectLight.position.set(0.3,1.5,-1);
        
        rectLight.rotateY(2.4)
        
    
        this.roomModel.add(rectLight);
        this.roomChildren["rectLight"] = rectLight;


        // const rectLightHelper = new RectAreaLightHelper(rectLight);
        // rectLight.add(rectLightHelper);
        // console.log(this.room);
        
    }
    

      if (sessionStorage.getItem("visited")) {
        if (
          child.name === "Mailbox" ||
          child.name === "ExteriorLamp" ||
          child.name === "Floor1" ||
          child.name === "Floor2" ||
          child.name === "Floor3" ||
          child.name === "FloorStep1" ||
          child.name === "FloorStep2" ||
          child.name === "Cube"
        ) {
          child.scale.set(0, 0, 0);
        }
      } else {
        child.scale.set(0, 0, 0);

        if (child.name === "Cube") {
          child.scale.set(0.5, 0.5, 0.5);
          child.position.set(0, 1, 0);
          child.rotation.y = -Math.PI / 4;
        }
      }

      this.roomChildren[child.name.toLowerCase()] = child;
    });



        


    this.scene.add(this.roomModel);
    this.roomModel.scale.set(0.5, 0.5, 0.5);
  }

  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      // console.log(e);
      this.rotation =
        ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;

      this.lerp.target = this.rotation * 0.1;
    });
  }

  resize() {}

  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );

    this.roomModel.rotation.y = this.lerp.target;
  }


  switchTheme(theme){
    if(theme==="dark"){
      const light = new THREE.PointLight( 0xff0000, 1, 100 );
    light.position.set(-1.31742,0.28857,2.21327 );
    this.roomModel.add( light );

    const lighthelper = new THREE.PointLightHelper(light);
    this.roomModel.add(lighthelper);
    }
  }
}
