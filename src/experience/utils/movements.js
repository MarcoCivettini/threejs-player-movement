export default class Movements {
    constructor() {


        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;

        this.run = false;


        window.addEventListener("keydown", (event) => {
            switch (event.key.toLowerCase()) {
                case 'a': // left arrow
                    this.left = true;
                    break;
                case 'w': // up arrow
                    this.up = true;
                    break;
                case 'd': // right arrow
                    this.right = true;
                    break;
                case 's': // down arrow
                    this.down = true;
                    break;
                case 'shift':
                    this.run = true;
                    break;
            }
        });

        window.addEventListener("keyup", (event) => {
            switch (event.key.toLowerCase()) {
                case 'a': // left arrow
                    this.left = false;
                    break;
                case 'w': // up arrow
                    this.up = false;
                    break;
                case 'd': // right arrow
                    this.right = false;
                    break;
                case 's': // down arrow
                    this.down = false;
                    break;
                case 'shift':
                    this.run = false;
                    break;
            }
        });
    }
}
