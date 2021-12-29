import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      /* gravity: {
        y: 200,
      }, */
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("birdy", "assets/bird.png");
}

let bird = null;

function create() {
  this.add.image(0, 0, "sky").setOrigin(0, 0);
  bird = this.physics.add.sprite(80, 300, "birdy");
}
let totalDelta = null;

function update(time, delta) {}

new Phaser.Game(config);
