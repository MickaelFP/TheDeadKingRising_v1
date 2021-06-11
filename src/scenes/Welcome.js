class Welcome extends Phaser.Scene {
    constructor(){
      super("bootGame");
    }
  
    preload ()
    {
        // images
        this.load.image('startBG', 'assets/backgrounds/startBackground.png');
        this.load.image('startB', 'assets/elements/startBouton.png');
        this.load.image('logo', 'assets/elements/PlatformerLogoRemastered_400x400.png');
        //this.load.spritesheet('cp', 'assets/cp.png', { frameWidth: 206, frameHeight: 184 } );

        // audios
        //this.load.audio('welcome1', 'assets/Sound/Dark-Hero-3.mp3');
        this.load.audio('welcome', 'assets/Sound/Piano_Sonata_no_14_SV.mp3');
        this.load.audio('drapeau', 'assets/Sound/Drapeau_ID-1788.wav');
    }
  
    create()
    {
        // Fonts : Script MT Bold, Script MT

        //---------- on clean le storage ----------

        localStorage.removeItem("bougie");
        localStorage.removeItem("bougie1");
        localStorage.removeItem("bougie2");
        localStorage.removeItem("bougie3");
        localStorage.removeItem("torche");
        localStorage.removeItem("torche1");
        localStorage.removeItem("torche2");
        localStorage.removeItem("torche3");
        localStorage.removeItem("torche4");
        localStorage.removeItem("torche5");
        localStorage.removeItem("torche6");
        localStorage.removeItem("torche7");
        localStorage.removeItem("torche8");

        //---------- booleans que l'on compte utiliser ----------

        this.touchePressed = false;

        /*if(Tableau.current && Tableau.current.player); // Tableau.current.playerIsCreated)
        {
            Tableau.current.playerIsCreated = false;
        }*/
        
        
        //---------- gestion des musiques ----------

        this.game.sound.stopAll();
        this.welcome = this.sound.add('welcome');
        var musicConfig = 
        {
            mute: false,
            volume: 1,
            rate : 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay:0,
        }
        this.welcome.play(musicConfig);

  
        //---------- on affiche les images à l'écran ----------

        this.add.sprite(game.config.width/2, game.config.height/2, 'startBG').setAlpha(0.5);
        this.add.sprite(game.config.width/6, game.config.height/3, 'logo').setDisplaySize(320,320);

        let logoLight = this.add.pointlight(game.config.width/4, game.config.height/2.5, 0, 200, 0.5);
        logoLight.attenuation = 0.05;
        logoLight.color.setTo(255, 50, 255);
  

        //---------- on affiche les boutons ----------

        let startB1 = this.add.sprite(game.config.width/2-8, game.config.height -150, 'startB');
        let startB2 = this.add.sprite(game.config.width/2-8, game.config.height -50, 'startB');
        let startB3 = this.add.sprite(game.config.width/2-8, game.config.height -250, 'startB');
        //startB.scale = 0.5;


        //---------- on affiche les textes que l'on veut faire apparaître (boutons, titre...) ----------

        let startBText1 = this.add.text(game.config.width/2-80, game.config.height -265, "Play",{font: "28px Script MT", fill:"#000000"}); //375,560,FFF
        let startBText2 = this.add.text(game.config.width/2-80, game.config.height -165, "Ctrls",{font: "28px Script MT", fill:"#000000"});
        let startBText3 = this.add.text(game.config.width/2-80, game.config.height -65, "Credits",{font: "28px Script MT", fill:"#000000"});

        let startBText1_2 = this.add.text(game.config.width/2-12, game.config.height -265, "[enter]",{font: "28px Script MT", fill:"#000000"});
        let startBText2_2 = this.add.text(game.config.width/2-12, game.config.height -165, "[space]",{font: "28px Script MT", fill:"#000000"});
        let startBText3_2 = this.add.text(game.config.width/2+12, game.config.height -65, "[U]",{font: "28px Script MT", fill:"#000000"});

        //tweens permet de donner un petit effet à la cible voulue (target)
        this.tweens.add(
        {
            targets:[startBText1_2, startBText2_2, startBText3_2],
            duration:2000,
            yoyo: true,
            repeat:-1,
            delay:0,
            alpha:
            {
                startDelay:0,
                from:0,
                to:1,
            }
        })

        
        //---------- quelques effets supplémentaires symphatiques ----------

        let lanterne = this.add.pointlight(game.config.width/2-378, game.config.height/2+32, 0, 50, 0.5);
        lanterne.attenuation = 0.05;
        lanterne.color.setTo(255, 200, 0);
        let lanterne5 = this.add.pointlight(game.config.width/2+242, game.config.height/2+38, 0, 30, 0.5);
        lanterne5.attenuation = 0.05;
        lanterne5.color.setTo(255, 200, 0);

        /*let lanterne2 = this.add.pointlight(game.config.width/2-250, game.config.height/2+40, 0, 30, 0.5);
        lanterne2.attenuation = 0.05;
        lanterne2.color.setTo(255, 200, 0);*/
        let lanterne6 = this.add.pointlight(game.config.width/2+370, game.config.height/2+31, 0, 50, 0.5);
        lanterne6.attenuation = 0.05;
        lanterne6.color.setTo(255, 200, 0);

        /*let lanterne3 = this.add.pointlight(game.config.width/2-190, game.config.height/2+45, 0, 15, 0.5);
        lanterne3.attenuation = 0.05;
        lanterne3.color.setTo(255, 200, 0);*/
        let lanterne4 = this.add.pointlight(game.config.width/2+182, game.config.height/2+45, 0, 15, 0.5);
        lanterne4.attenuation = 0.05;
        lanterne4.color.setTo(255, 200, 0);


        this.tweens.add(
        {
            targets:[lanterne, lanterne6],
            duration:1000,
            yoyo: true,
            repeat:-1,
            delay:0,
            alpha:
            {
                startDelay:0,
                from:0,
                to:1,
            }
        })
        this.tweens.add(
        {
            targets:[/*lanterne2, */lanterne5],
            duration:2000,
            yoyo: true,
            repeat:-1,
            delay:0,
            alpha:
            {
                startDelay:0,
                from:0,
                to:1,
            }
        })
        this.tweens.add(
        {
            targets:[/*lanterne3, */lanterne4],
            duration:3000,
            yoyo: true,
            repeat:-1,
            delay:0,
            alpha:
            {
                startDelay:0,
                from:0,
                to:1,
            }
        })



        //---------- on initialise les touches du clavier pour lancer le jeu, activer/desactiver des options, etc ----------

        /*if(Tableau.current){
            Tableau.current._destroy();
        }
        this.game.scene.start(tableau);
        this.scene.start("aventureBegining");*/

        this.input.keyboard.on('keydown-ENTER', function () //'keydown-SPACE', function () 
        {
            if (!this.touchePressed)
            {
                this.touchePressed = true;
                this.music = this.sound.add('drapeau');
                var musicConfig = 
                {
                    mute: false,
                    volume: 1,
                    rate : 1,
                    detune: 0,
                    seek: 0,
                    loop: false,
                    delay:0,
                }
                this.music.play(musicConfig);

                this.cameras.main.fadeOut(1000, 0, 0, 0)
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => 
                {
                    this.game.scene.start(Niveau1);
                    this.scene.start("Cemetary");
                })
            }

        }, this);


        this.input.keyboard.on('keydown-SPACE', function ()
        {
            if (!this.touchePressed) //(!this.SpacePressed & !this.EnterPressed)
            {
                this.touchePressed = true;
                this.music = this.sound.add('drapeau');
                var musicConfig = 
                {
                    mute: false,
                    volume: 1,
                    rate : 1,
                    detune: 0,
                    seek: 0,
                    loop: false,
                    delay:0,
                }
                this.music.play(musicConfig);
    
                this.cameras.main.fadeOut(1000, 0, 0, 0)
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => 
                {
                    //this.EnterPressed = true;
                    this.game.scene.start(ControlsPanel);
                    this.scene.start("panel");
                })
            }

        }, this);

        this.input.keyboard.on('keydown-U', function ()
        {
            if (!this.touchePressed) //(!this.SpacePressed & !this.EnterPressed)
            {
                this.touchePressed = true;

                this.music = this.sound.add('drapeau');
                var musicConfig =
                    {
                        mute: false,
                        volume: 1,
                        rate : 1,
                        detune: 0,
                        seek: 0,
                        loop: false,
                        delay:0,
                    }
                this.music.play(musicConfig);

                this.cameras.main.fadeOut(1000, 0, 0, 0)
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) =>
                {
                    //this.EnterPressed = true;
                    this.game.scene.start(Credits);
                    this.scene.start("credit");
                })
            }

        }, this);

        this.input.on('pointerdown', function(pointer)
        {
            if (!this.touchePressed)
            {
                this.touchePressed = true;

                this.music = this.sound.add('drapeau');
                var musicConfig =
                    {
                        mute: false,
                        volume: 1,
                        rate : 1,
                        detune: 0,
                        seek: 0,
                        loop: false,
                        delay:0,
                    }
                this.music.play(musicConfig);

                this.cameras.main.fadeOut(1000, 0, 0, 0)
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) =>
                {
                    /*if(Tableau.current){
                        Tableau.current._destroy();
                    }
                    this.game.scene.start(tableau);
                    this.scene.start("aventureBegining");*/
                    this.game.scene.start(Niveau1);
                    this.scene.start("Cemetary");
                })
            }

        },this);
    }
    
}
