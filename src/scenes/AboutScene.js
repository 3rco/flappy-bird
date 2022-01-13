import BaseScene from "./BaseScene";

class AboutScene extends BaseScene {
  constructor(config) {
    super("AboutScene", { ...config, canGoBack: true });
  }

  create() {
    super.create();
    this.bird = this.physics.add.sprite(380, 270, "birdy").setScale(3);

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("birdy", { start: 16, end: 18 }),
      frameRate: 6,
      repeat: -1,
    });

    this.bird.play("idle");

    this.add
      .text(...this.screenCenter, "Erco", this.fontOptions)
      .setOrigin(0.5);
  }
}

export default AboutScene;
