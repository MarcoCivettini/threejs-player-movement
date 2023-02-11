import Experience from "../experience";
import Environment from "./enviroment";
import Floor from "./floor";
import Fox from "./fox";
import Soldier from "./soldier";

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.resources.on(('ready'), () => {

            // Setup
            this.floor = new Floor();
            // this.fox = new Fox();
            this.soldier = new Soldier();
            this.enviroment = new Environment();
        })
    }

    update() {
        if (this.soldier) {
            this.soldier.update();
        }
    }
}