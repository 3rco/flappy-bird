import BaseScene from "./BaseScene";

class MenuScene extends BaseScene {
  constructor(config) {
    super("MenuScene", config);

    this.menu = [
      { scene: "PlayScene", text: "Play" },
      { scene: "ScoreScene", text: "Score" },
      { scene: "AboutScene", text: "About" },
      { scene: null, text: "Exit" },
    ];
  }

  create() {
    super.create();
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "birdy")
      .setFlipX(true)
      .setScale(3);

    this.bird.setBodySize(this.bird.width, this.bird.height - 8);
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));

    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("birdy", { start: 8, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });

    this.bird.play("fly");
  }

  setupMenuEvents(menuItem) {
    const textGO = menuItem.textGO;
    textGO.setInteractive();

    textGO.on("pointerover", () => {
      textGO.setStyle({ fill: "#ff0" });
    });

    textGO.on("pointerout", () => {
      textGO.setStyle({ fill: "#fff" });
    });

    textGO.on("pointerup", () => {
      menuItem.scene && this.scene.start(menuItem.scene);

      if (menuItem.text === "Exit") {
        location.href = "https://ercanunal.dev/";
        this.game.destroy(true);
      }
    });
  }
}

export default MenuScene;
