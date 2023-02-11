import Experience from "../experience";
import * as THREE from 'three';

const WALK_SPEED = 0.03;
const RUN_SPEED = 0.06;


export default class Soldier {
    constructor() {
        this.expirience = new Experience();
        this.scene = this.expirience.scene;
        this.resources = this.expirience.resources;
        this.time = this.expirience.time;
        this.debug = this.expirience.debug;
        this.speed = WALK_SPEED;
        this.rotationSmoothing = 0.15;

        this.movements = this.expirience.movements;

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('soldier');
        }

        this.resource = this.resources.items.soldierModel;

        this.setModel();
        this.setAnimation();

    }

    setModel() {
        this.model = this.resource.scene;

        // let weaponGeometry = new THREE.BoxGeometry(1, 1, 1);
        // let weaponMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        // let weapon = new THREE.Mesh(weaponGeometry, weaponMaterial);
        // const rightHand = this.model.getObjectByName("mixamorigRightHand");
        // weapon.scale.set(20, 20, 20);
        // rightHand.add(weapon);


        this.scene.add(this.model);

        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
            }
        })

    }

    setAnimation() {
        this.animation = {};
        this.animation.mixer = new THREE.AnimationMixer(this.model);
        this.animation.actions = {}
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0]);
        this.animation.actions.run = this.animation.mixer.clipAction(this.resource.animations[1]);
        this.animation.actions.walk = this.animation.mixer.clipAction(this.resource.animations[3]);

        this.animation.actions.current = this.animation.actions.idle;
        this.animation.actions.current.play();


        this.animation.play = (name) => {
            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;
            newAction.reset();
            newAction.play();
            newAction.crossFadeFrom(oldAction, 0.1);
            this.animation.actions.current = newAction;
        }

        if (this.debug.active) {
            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playRunning: () => { this.animation.play('run') },
                playWalking: () => { this.animation.play('walk') }
            }
            this.debugFolder.add(debugObject, 'playIdle');
            this.debugFolder.add(debugObject, 'playRunning');
            this.debugFolder.add(debugObject, 'playWalking');
        }

    }

    update() {
        this.animation.mixer.update(this.time.delta * 0.001);
        let xSpeed = 0;
        let zSpeed = 0;
        let targetAngle = this.model.rotation.y;
        let moveAnimation = 'walk';

        if(this.movements.run){
            this.speed = RUN_SPEED;
            moveAnimation = 'run'
        }else{
            this.speed = WALK_SPEED;
            moveAnimation = 'walk'
        }

        if (this.movements.left || this.movements.right || this.movements.up || this.movements.down) {
            this.playAnimation(moveAnimation)
            if (this.movements.left) xSpeed -= this.speed; // Left arrow
            if (this.movements.up) zSpeed -= this.speed; // Up arrow
            if (this.movements.right) xSpeed += this.speed; // Right arrow
            if (this.movements.down) zSpeed += this.speed; // Down arrow

            if (xSpeed || zSpeed) {
                targetAngle = Math.atan2(-xSpeed, -zSpeed);
                this.model.position.x += xSpeed;
                this.model.position.z += zSpeed;
            }

            var angleDiff = targetAngle - this.model.rotation.y;
            angleDiff = (angleDiff + Math.PI) % (2 * Math.PI) - Math.PI;

            this.model.rotation.y += angleDiff * this.rotationSmoothing;
        } else {
            this.playAnimation('idle')
        }

    }

    playAnimation(actionName) {
        const newAction = this.animation.actions[actionName];
        const oldAction = this.animation.actions.current;
        if (newAction !== oldAction) {
            this.animation.play(actionName)
        }
    }
}