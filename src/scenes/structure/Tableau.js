/**
 * Toutes les fonctions propres à un tableau dans notre jeu.
 * Cette classe n'est pas à utiliser directement, elle doit être extend !
 */
class Tableau extends Phaser.Scene{
    /**
     *
     * @param {String} key identifiant de la scène à jouer
     */
    constructor(key) {
        super(key);

        this.lifePoints=3;
    }

    /**
     * Par défaut on charge un fond et le player
     */
    preload(){
        this.load.image('sky', 'assets/backgrounds/sky3.png');

        this.load.image('ossement', 'assets/elements/ossement.png');
        this.load.image('etoffe', 'assets/elements/etoffes.png');
        this.load.image('blood', 'assets/elements/bloodblack.png');
        this.load.image('spike', 'assets/elements/spike.png');
        this.load.image('osExplosion', 'assets/elements/persoMort.png');
        this.load.image('broke', 'assets/elements/vaseBroke.png');

        this.load.image('infCtrl', 'assets/elements/infos_controls3.png');
        this.load.image('hp0', 'assets/ui/hp0.png');
        this.load.image('hp1', 'assets/ui/hp1.png');
        this.load.image('hp2', 'assets/ui/hp2.png');
        this.load.image('hp3', 'assets/ui/hp3.png');

        //this.load.image('cacheTop', 'assets/backgrounds/cache_haut_ok.png');
        //this.load.image('cacheBot', 'assets/backgrounds/cache_bas_ok.png');

        this.load.spritesheet('power', 'assets/Spritesheet/power1.png', { frameWidth: 260, frameHeight: 253 } );
        this.load.spritesheet('zombie2', 'assets/Spritesheet/zombie_remastered2.png', { frameWidth: 32, frameHeight: 56 } ); 
        this.load.spritesheet('monster-fly', 'assets/Spritesheet/chauve-sourie-1.png', { frameWidth: 55, frameHeight: 51 } );
        this.load.spritesheet('player', 'assets/Spritesheet/playerRemastered4.png', { frameWidth: 32, frameHeight: 64  } );

        this.load.audio('osMus', 'assets/Sound/os_sound.mp3');
        this.load.audio('tissu', 'assets/Sound/souffle_air.mp3');
        this.load.audio('splash', 'assets/Sound/splash.mp3');
        this.load.audio('crack', 'assets/Sound/crack.mp3');
        this.load.audio('brkkk', 'assets/Sound/broke_sound.mp3');
        this.load.audio('chute', 'assets/Sound/boule_neige.mp3');
        this.load.audio('solPierreBrise', 'assets/Sound/explosion-1.mp3');
        this.load.audio('solEffondre', 'assets/Sound/explosion-2.mp3');
        this.load.audio('shhh', 'assets/Sound/sabre-9.mp3');
        this.load.audio('waow', 'assets/Sound/boule_magique.mp3');

    }
    create() {

        // ----------------------------------- Données primaires indispensable au tabbleau -----------------------------------

        Tableau.current = this;

        this.isMobile = this.game.device.os.android || this.game.device.os.iOS;
        this.isMobilePerso = !this.isMobile; // this./*scene.sys.*/game.device.os.desktop;

        this.sys.scene.scale.lockOrientation("landscape")
        //console.log("On est sur " + this.constructor.name + " / " + this.scene.key);

        this.depthConst = 500;

        /**
         * Le ciel en fond
         * @type {Phaser.GameObjects.Image}
         */
        this.sky = this.add.image(0, 0, 'sky').setOrigin(0, 0);
        this.sky.displayWidth = 14 * 64;
        this.sky.setScrollFactor(0, 0);

        /**
         * Le joueur
         * @type {Player}
         */
        this.player = new Player(this, 160, 1952); // (this, 6208, 768);
        this.player.setMaxVelocity(800, 800); //évite que le player quand il tombe ne traverse des plateformes
        this.playerPower = 0;

        this.auraDamage = this.add.pointlight(this.player.x, this.player.y, 0, 2000, 0.02);
        this.auraDamage.setDepth(999);
        this.auraDamage.attenuation = 0.1;
        this.auraDamage.color.setTo(354, 10, 10);
        this.auraDamage.visible = false;

        this.auraHeal = this.add.pointlight(this.player.x, this.player.y, 0, 2000, 0.02);
        this.auraHeal.setDepth(999);
        this.auraHeal.attenuation = 0.1;
        this.auraHeal.color.setTo(0, 255, 0);
        this.auraHeal.visible = false;

        this.pv3 = this.add.sprite(90, 100, "hp3");
        this.pv3.setDepth(1000);
        this.pv3.setScrollFactor(0);

        ui._hpText.setText('Body : ');

        this.shoot = new ElementProjectils(this, 0 + 8600, 0 + 4448);
        this.monsterOfVase = new MonsterZombie(this, 0 + 8600, 0 + 4448)
                .setVelocity(0, 0);

        // ----------------------------------- fonction en booleans d'affichage d'image -----------------------------------

        this.blood = this.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "blood");
        this.blood.displayWidth = 64;
        this.blood.displayHeight = 64;
        this.blood.visible = false;

        this.blood2 = this.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "osExplosion");
        this.blood2.displayWidth = 64;
        this.blood2.displayHeight = 64;
        this.blood2.visible = false;

        this.broke = this.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "broke");
        this.broke.displayWidth = 32;
        this.broke.displayHeight = 32;
        this.broke.visible = false;

        this.infCtrl = this.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "infCtrl");
        this.infCtrl.displayWidth = 400;
        this.infCtrl.displayHeight = 400;
        this.infCtrl.visible = false;
        this.infCtrl.setScrollFactor(0).setDepth(1000);


        // ----------------------------------- booleans simples que l'on compte utiliser -----------------------------------
        //
        this.aPressed = false;
        this.oneShootOnly = true;
        this.youCanDestroyIt = false;
        //this.projectilDestroyed = false;
        //
        this.iPressed = false;
        this.showInfos = false;
        this.infosTime = true;
        this.firstInfos = true;
        //
        this.ControlPressed = false;
        //
        this.pPressed = false;
        this.pauseTime = true;
        this.firstTimePressed = true;
        //
        this.ePressed = false;
        this.oneHeal = false;
        this.startAuraHeal = false;
        //
        this.dPressed = false;
        this.timingDash = false;
        this.oneTiming = true;
        this.oneDash = false;
        this.accelerationSpeed1 = false;
        this.dashActivated = false;
        //
        this.arrowRightUnpressed = false;
        this.arrowRightPressed = false;
        this.arrowLeftUnpressed = false;
        this.arrowLefttPressed = false;
        this.playerMoveStop = false;
        //this.contactSolides = false;
        //
        this.keyboardArrowUp = false;
        this.arrowUpPressed = false;
        this.jumpStop = false;
        this.timingJump = true;
        this.stopTomber = false;
        this.firstJump = true;
        //
        this.arrowDownPressed = false;
        this.tJArrowDownPressed = false;
        //
        this.vaseDrope = false;
        this.oneDrope = false;
        this.monsterOfVaseIsDead = false;
        //
        this.invicibleForEver = false;
        this.startAuraDmg = false;
        //
        this.destructionTorcheLight = false;;
        this.walking = true;
        this.monsterMoveStop = false;
        //
        this.bossShield = false;
        this.oneDropePower = false;
        this.oneShotOnBoss = false;
        this.hpMiniBoss = 10;
        //
        this.antiBug = true;

        this.monsterVaseEffectUnSeul = false;
        this.unSeulEffectMV = true;
        this.onNeVieQuneFoisMV = true;

        this.miniBossEffectUnSeul = false;
        this.miniBossEffect2UnSeul = false;
        this.miniBossEffect2StopUnSeul = false;

        // ----------------------------------- Quelques sons -----------------------------------

        if(this.isMobilePerso)
        {
            this.rocheSound = this.sound.add('pousserRoche');
            this.musicConfigX =
                {
                    mute: false,
                    volume: 1,
                    rate: 1,
                    detune: 0,
                    seek: 0,
                    loop: true,
                    delay: 0,
                }
            this.rocheSound2 = this.sound.add('pousserRoche');
            this.musicConfigX2 =
                {
                    mute: false,
                    volume: 1,
                    rate: 1,
                    detune: 0,
                    seek: 0,
                    loop: true,
                    delay: 0,
                }
            this.musicSplash = this.sound.add('splash');
            this.musicConfigSplash =
                {
                    mute: false,
                    volume: 0.3,
                    rate : 1,
                    detune: 0,
                    seek: 0,
                    loop: false,
                    delay:0,
                }
            this.deadSquelette = this.sound.add('crackSkull');
            this.squeletteAttraction = this.sound.add('skullAttract');
            this.musicConfigMSd =
                {
                    mute: false,
                    volume: 1,
                    rate: 1,
                    detune: 0,
                    seek: 0,
                    loop: false,
                    delay: 0,
                }
            this.musicConfigMSa =
                {
                    mute: false,
                    volume: 0.5,
                    rate: 1,
                    detune: 0,
                    seek: 0,
                    loop: false,
                    delay: 0,
                }
            this.deadZombie = this.sound.add('splashZomb');
            this.zombieAttraction = this.sound.add('zombAttract');
            this.musicConfigMZALL =
                {
                    mute: false,
                    volume: 0.3,
                    rate: 1,
                    detune: 0,
                    seek: 0,
                    loop: false,
                    delay: 0,
                }
            //this.deadChauveSourie = this.sound.add('splashChauveSourie');
            this.chauveSourieAttraction = this.sound.add('chauveSourieAttract');
            this.musicConfigMCSa =
                {
                    mute: false,
                    volume: 1,
                    rate: 1,
                    detune: 0,
                    seek: 0,
                    loop: false,
                    delay: 0,
                }

            /*this.deadMiniBoss = this.sound.add('splashMBoss')
            this.miniBossAttraction = this.sound.add('mBossAttract')
            this.musicConfigMBALL =
                {
                    mute: false,
                    volume: 1,
                    rate : 1,
                    detune: 0,
                    seek: 0,
                    loop: false,
                    delay:0,
                }*/
        }
    }


    // ********************************* Exécutable de fonction et de variables à chaques frames *********************************

    /**
     *
     * @param {function} onComplete Fonction à appeler quand l'anim est finie
     */
    update(monster, player, onComplete)
    {
        super.update();
        this.player.update(); 
        this.shoot.update();
        this.monsterOfVase.update();

        //this.shoot.move();
        //this.contact = false ;
        //this.jumpStop = false;

        // ----------------------------------- Effets pour chaques touches configurées -----------------------------------

        this.deplacementPlayerOptimisation();   // Quand le joeur se déplace
        this.jumper();                          // Quand le joueur saute

        this.throwBones();                      // Lancer des projectils
        this.playerHealing();                   // Se soigner
        this.dash();                            // dash...
        //this.fullScreenFonction();
        this.powerLevel();                      // Rammasser un collectible qui débloque des capacités / compétences

        // ----------------------------------- Effets déclenchés -----------------------------------

        this.vaseDropping();                    // Faire drope des choses quand on détruit quelquechose
        this.auraEffect();                      // Effet d'éclairage de l'écran (feedback : dégats, heal, luminosité...)
        //this.cacheCache();                      // Faire apparaître des images suivant la positions du joueur
        this.collisionSup();                    // Quelques effets de collisions (destruction de projectil, perte de pv...)

        if(this.isMobilePerso)
        {
            this.showInfoCtrl();                    // Afficher une image d'information
            this.pause();                           // Mettre le jeu en pause (mouvements joueur et monstres stoppés, plus invulnérabilité)
            this.clearCheckPoints();                // Reset les checkPoints
        }


        /* ************************************************************************************* */



        /* ************************************************************************************* */

    } // FIN DE UPDATE


    /* ***************************************** Dead Effects : Sound / sprite... ******************************/
    //
    zombieEffect(monster)
    {
        this.deadZombie.play(this.musicConfigMZALL);

        this.saigne(monster,function(){});
        this.musicSplash.play(this.musicConfigSplash);
    }
    zombieEffect2()
    {
        this.zombieAttraction.play(this.musicConfigMZALL);
    }
    //
    squeletteEffect()
    {
        let me = this;
        this.saignePlayer(this.player, function ()
        {
            me.blood2.visible = false;
        });
        this.deadSquelette.play(this.musicConfigMSd);
    }
    squeletteEffect2()
    {
        this.squeletteAttraction.play(this.musicConfigMSa);
    }
    //
    chauveSourieEffect(monster)
    {
        //this.deadChauveSourie.play(this.musicConfigMCSd);

        this.saigne(monster,function(){});
        this.musicSplash.play(this.musicConfigSplash);
    }
    chauveSourieEffect2()
    {
        this.chauveSourieAttraction.play(this.musicConfigMCSa);
    }
    //
    monsterVaseEffect()
    {
        this.deadZombie.play(this.musicConfigMZALL);

        let me=this;
        me.blood.visible = true;
        me.blood.rotation = Phaser.Math.Between(0,6);
        me.blood.x = Tableau.current.player.body.position.x + 16;
        me.blood.y = Tableau.current.player.body.position.y + 64;
        me.tweens.add({
            targets:me.blood,
            duration:200,
            displayHeight:
                {
                    from:40,
                    to:70,
                },
            displayWidth:
                {
                    from:40,
                    to:70,
                },
            onComplete: function ()
            {
                me.blood.visible = false;
                //onComplete();
            }
        })
        this.musicSplash.play(this.musicConfigSplash);
    }
    monsterVaseEffect2()
    {
        this.zombieAttraction.play(this.musicConfigMZALL);
    }
    //
    miniBossEffect(monster)
    {
        if(!this.miniBossEffectUnSeul)
        {
            //this.deadMiniBoss.play(this.musicConfigMBD);

            this.saigne(monster,function(){});
            this.musicSplash.play(this.musicConfigSplash);

            this.miniBossEffectUnSeul = true;
        }
    }
    miniBossEffect2()
    {
        if(!this.miniBossEffect2UnSeul)
        {
            //this.miniBossEffectAttraction.play(this.musicConfigMBA);
            this.miniBossEffect2UnSeul = true;
            this.miniBossEffect2StopUnSeul = false;
        }
    }
    miniBossEffect2Stop()
    {
        if(!this.miniBossEffect2StopUnSeul)
        {
            this.miniBossEffect.stop();
            this.miniBossEffect2UnSeul = false;
            this.miniBossEffect2StopUnSeul = true;
        }
    }
    /* **********************************************************/


    collisionSup(monsterOfVase, miniBoss, shoot)
    {
        this.physics.add.overlap(this.monsterOfVase, this.shoot, function(monsterOfVase, shoot)
        {
            this.destroyProjectil();

        }, null, this);

        this.physics.add.overlap(this.miniBoss, this.shoot, function(miniBoss, shoot)
        {
            this.destroyProjectil();
            this.miniBossLife();

        }, null, this);

    }


    powerLevel()
    {
        if(this.playerPower >= 1)
        {
            this.dashActivated = true;
        }
        else { this.dashActivated = false }
    }


    // Pour plus de fluidité de le changement de direction gauche/droite, droite/gauche (Uniquement sur PC) et un effet plus réaliste des déplacement
    // Fonctions ...Unpressed définies dans Tableau.js et appelées true dans GameKeyboard.js
    // Fonctions staticY et semiMobileY définies dans Player.js, correspondent au mouvement du joueur par rapport à l'axe Y (tomber, sauter ou aucun des deux)
    deplacementPlayerOptimisation() 
    {
        if(this.arrowLeftUnpressed) 
        {
            if(Tableau.current.player.staticY) // Quand le joueur ne saute pas ni ne tombe
            {
                if(this.arrowRightPressed)
                {
                    //console.log("Mystère 1 : Left -> y Right");
                    this.player.directionX = 1;
                    this.arrowLeftUnpressed = false;
                }
                else
                {
                    //console.log("Mystère 1 : Left -> n Right");
                    this.player.directionX = 0;
                    this.arrowLeftUnpressed = false;
                }
            }
            /*else if (Tableau.current.player.semiMobileY) // Quand le joueur saute ou tombe
            {
                if(this.arrowRightPressed)
                {
                    console.log("Mystère 1 : Left -> y Right");
                    this.player.directionX = 1;
                    this.arrowLeftUnpressed = false;
                }
                else
                {
                    console.log("Mystère 1 : Left -> n Right");
                    this.player.directionX = -1;
                    this.arrowLeftUnpressed = false;
                }
            }*/
        }

        else if(this.arrowRightUnpressed)
        {
            if (Tableau.current.player.staticY) 
            {
                if(this.arrowLeftPressed)
                {
                    //console.log("Mystère 2 : Right -> y Left");
                    this.player.directionX = -1;
                    this.arrowRightUnpressed = false;
                }
                else
                {
                    //console.log("Mystère 2 : Right -> n Left");
                    this.player.directionX = 0;
                    this.arrowRightUnpressed = false;
                }
            }
            /*else if(Tableau.current.player.semiMobileY)
            {
                if(this.arrowLeftPressed)
                {
                    console.log("Mystère 2 : Right -> y Left");
                    this.player.directionX = -1;
                    this.arrowRightUnpressed = false;
                }
                else
                {
                    console.log("Mystère 2 : Right -> n Left");
                    this.player.directionX = 1;
                    this.arrowRightUnpressed = false;
                }
            }*/
        }

        // Pour éviter que le joueur ne se déplace sans que l'on appuye sur une touche lorsqu'il retombe au sol
        if(!this.arrowLeftPressed && !this.arrowRightPressed && Tableau.current.player.staticY)
        {
            Tableau.current.player.directionX = 0;
        }

    } // FIN DE deplacementPlayerOptimisation()


    jumper()
    {
        if(this.arrowUpPressed && !this.player.isDead)
        {
            if(this.firstJump)
            {
                this.player.directionY = -1;
                this.jumpStop = false;
                this.firstJump = false;
            }
            else
            {
                this.player.directionY = 0;
            }

            if(!this.keyboardArrowUp)
            {
                this.time.addEvent
                ({
                    delay: 200,
                    callback: ()=>
                    {
                        this.arrowUpPressed = false;
                    },
                    loop: false
                })
            }

        }
    } // FIN DE jumper()


    timingJumping()
    {
        this.time.addEvent
        ({
            delay: 1000,
            callback: ()=>
            {
                this.timingJump = true;
            },
            loop: false
        })
    } // FIN DE timingJumping()

    tJAfterPressArrowDown()
    {
        this.jumpStop = true;
        this.tJArrowDownPressed = true;
        this.time.addEvent
        ({
            delay: 1000,
            callback: ()=>
            {
                this.tJArrowDownPressed = false;
                this.jumpStop = false;
            },
            loop: false
        })
    } // FIN DE tJAfterPressArrowDown()


    playerIntangible()
    {
        this.player.isDead = true;
    }
    playerTangible()
    {
        this.player.isDead = false;
    }


    pause()
    {
        if(this.pPressed && this.pauseTime)
        {
            if(this.firstTimePressed)
            {
                //this.playerMoveStop = true;
                this.playerIntangible();
                this.monsterMoveStop = true;
                this.pauseTime = false;
                this.firstTimePressed = false;
            }
            else
            {
                this.playerTangible();
                //this.playerMoveStop = false;
                this.monsterMoveStop = false;
                this.pauseTime = false;
                this.firstTimePressed = true;
            }
        }

    }

    
    // ********************************* Gestionnaire de l'affichage des points de vies *********************************

    InfosLifePoints()
    {
        if(!this.player.isDead)
        {
            if(this.lifePoints == 2)
            {
                this.pv2=this.add.sprite(90, 100, "hp2");
                this.pv2.setDepth(1000);
                this.pv2.setScrollFactor(0);
                this.pv3.destroy();
            }
            if(this.lifePoints == 1)
            {
                this.pv1=this.add.sprite(90, 100, "hp1");
                this.pv1.setDepth(1000);
                this.pv1.setScrollFactor(0);
                this.pv2.destroy();
            }
            if(this.lifePoints == 0)
            {
                this.pv0=this.add.sprite(90, 100, "hp0");
                this.pv0.setDepth(1000);
                this.pv0.setScrollFactor(0);
                this.pv1.destroy();
            }
        }

    }
    InfosLifePoints2()
    {
        if(!this.player.isDead)
        {
            if(this.lifePoints == 3)
            {
                this.pv3=this.add.sprite(90, 100, "hp3");
                this.pv3.setDepth(1000);
                this.pv3.setScrollFactor(0);
                this.pv2.destroy();
            }
            if(this.lifePoints == 2)
            {
                this.pv2=this.add.sprite(90, 100, "hp2");
                this.pv2.setDepth(1000);
                this.pv2.setScrollFactor(0);
                this.pv1.destroy();
            }
        }
    }


    auraEffect()
    {
        if(this.startAuraDmg)
        {
            this.auraDamage.setPosition(this.player.x, this.player.y);
            this.auraDamage.visible=true;
        }
        else if(!this.startAuraDmg)
        {
            this.auraDamage.setPosition(this.player.x, this.player.y);
            this.auraDamage.visible=false;
        }

        if(this.startAuraHeal)
        {
            this.auraHeal.setPosition(this.player.x, this.player.y);
            this.auraHeal.visible=true;
        }
        else if(!this.startAuraHeal)
        {
            this.auraHeal.setPosition(this.player.x, this.player.y);
            this.auraHeal.visible=false;
        }
    }

    vaseDropping()
    {
        if(this.isMobilePerso)
        {
            //this.monsterOfVase.update();
            if(this.vaseDrope)
            {
                // Certains paramètres déjà définis doivent de nouveau l'être ici : collisions...
                if (this.oneDrope)
                {
                    let me = this;


                    me.randomDropVase();


                    while (this.oneDrope)
                    {
                        this.oneDrope = false;
                        return;
                    }
                    me.vaseDrope = false;
                }
            }
        }
    }


    randomDropVase()
    {
        let me = this;

        me.monsterOfVase = new MonsterVase(this,this.player.x+150,this.player.y+24,"zombie2").setDepth(996);
        me.physics.add.collider(me.monsterOfVase, this.solides);
        me.physics.add.collider(me.monsterOfVase, this.platforms6);

        if(!me.monsterOfVaseIsDead)
        {
            this.time.addEvent
            ({
                delay: 5000,
                callback: ()=>
                {
                    if(!me.monsterOfVaseIsDead)
                    {
                        this.monsterOfVase.disableBody(true,true);
                        this.monsterOfVase.body.destroy();

                        this.monsterVaseEffect();

                        this.saigne(me.monsterOfVase,function(){})
                        this.music = this.sound.add('splash');
                        var musicConfig =
                            {
                                mute: false,
                                volume: 0.3,
                                rate : 1,
                                detune: 0,
                                seek: 0,
                                loop: false,
                                delay:0,
                            }
                        this.music.play(musicConfig);
                        this.monsterOfVaseIsDead = true;
                    }

                },
                loop: false
            })
        }
    }


    dash(player)
    {
        if(this.dPressed && !this.oneDash && this.dashActivated)
        {
            this.playerMoveStop = true
            if(this.player.body.velocity.x > 0)
            {
                if(this.player.body.velocity.y > 0)
                {
                    this.oneDash = true;
                    console.log("x > 0 et y > 0");
                    this.invincible();
                    this.player.setVelocityX(800);
                    this.player.setVelocityY(-500);
                    this.time.addEvent
                    ({
                        delay: 200,
                        callback: ()=>
                        {
                            console.log("biensure que non");
                            this.player.setVelocityX(160);
                            this.player.setVelocityY(0);
                            this.playerMoveStop = false;
                        },
                        loop: false
                    })
                }
                else if(this.player.body.velocity.y < 0)
                {
                    this.oneDash = true;
                    console.log("x > 0 et y < 0");
                    this.invincible();
                    this.player.setVelocityX(800);
                    this.player.setVelocityY(-500);
                    this.time.addEvent
                    ({
                        delay: 200,
                        callback: ()=>
                        {
                            console.log("biensure que non");
                            this.player.setVelocityX(160);
                            this.player.setVelocityY(0);
                            this.playerMoveStop = false;
                        },
                        loop: false
                    })
                }
                else
                {
                    this.oneDash = true;
                    console.log("x > 0 et y = 0");
                    this.invincible();
                    this.player.setVelocityX(800);
                    this.time.addEvent
                    ({
                        delay: 200,
                        callback: ()=>
                        {
                            console.log("biensure que non");
                            this.player.setVelocityX(160);
                            this.playerMoveStop = false;
                        },
                        loop: false
                    })
                }
            }
            else if (this.player.body.velocity.x < 0)
            {
                if(this.player.body.velocity.y > 0)
                {
                    this.oneDash = true;
                    console.log("x < 0 et y > 0");
                    this.invincible();
                    this.player.setVelocityX(-800);
                    this.player.setVelocityY(-500);
                    this.time.addEvent
                    ({
                        delay: 200,
                        callback: ()=>
                        {
                            console.log("biensure que non");
                            this.player.setVelocityX(-160);
                            this.playerMoveStop = false;
                        },
                        loop: false
                    })
                }
                else if(this.player.body.velocity.y < 0)
                {
                    this.oneDash = true;
                    console.log("x < 0 et y < 0");
                    this.invincible();
                    this.player.setVelocityX(-800);
                    this.player.setVelocityY(-500);
                    this.time.addEvent
                    ({
                        delay: 200,
                        callback: ()=>
                        {
                            console.log("biensure que non");
                            this.player.setVelocityX(-160);
                            this.player.setVelocityY(0);
                            this.playerMoveStop = false;
                        },
                        loop: false
                    })
                }
                else
                {
                    this.oneDash = true;
                    console.log("x < 0 et y = 0");
                    this.invincible();
                    this.player.setVelocityX(-800);
                    this.time.addEvent
                    ({
                        delay: 200,
                        callback: ()=>
                        {
                            console.log("biensure que non");
                            this.player.setVelocityX(-160);
                            this.playerMoveStop = false;
                        },
                        loop: false
                    })
                }
            }
            else
            {
                this.oneDash = true;
                console.log("x = 0");
                this.invincible();
                this.player.setVelocityY(-1000);
                this.time.addEvent
                ({
                    delay: 200,
                    callback: ()=>
                    {
                        console.log("biensure que non");
                        this.player.setVelocityY(0);
                        this.playerMoveStop = false;
                    },
                    loop: false
                })
            }
        }

        if(this.timingDash && this.oneTiming)
        {
            this.oneTiming = false;
            this.time.addEvent
            ({
                delay: 2000,
                callback: ()=>
                {
                    console.log("C bon tu peux");
                    this.timingDash = false;
                    this.oneDash = false;
                    this.oneTiming = true;
                },
                loop: false
            })
        }
    }


    /*acceleration1()
    {
        this.player.setVelocityX(800);
        this.time.addEvent
        ({
            delay: 1000,
            callback: ()=>
            {
                this.player.setVelocityX(160);
                this.timerDash = true;
                this.oneDash = false;
                this.dPressed = false;
            },
            loop: false
        })
    }*/


    clearCheckPoints()
    {
        if(this.ControlPressed)
        {
            localStorage.removeItem("checkPoint");
        }
    }


    showInfoCtrl()
    {
        //this.infCtrl.setPosition(this.player.x - 50, this.player.y);

        if (this.iPressed && this.infosTime)
        {
            if(this.firstInfos)
            {
                console.log("On affiche");

                let me = this;
                me.infCtrl.visible = true;

                me.infosTime = false;
                me.firstInfos = false;
            }
            else
            {
                console.log("On cache");

                let me = this;
                me.infCtrl.visible = false;

                me.infosTime = false;
                me.firstInfos = true;
            }
        }
    } // FIN DE SHOWINFOCTRL


    throwBones()
    {
        if (this.aPressed && this.oneShootOnly && ui.score >= 2)
        {
            let me = this;

            me.oneShootOnly = false;
            me.shoot=new ElementProjectils(this,this.player.x +30,this.player.y-30,"ossement").setDepth(996);
            me.physics.add.collider(this.solides, this.shoot);

            if(this.arrowRightPressed)
            {
                me.shoot.setVelocity(240, -200);//(240, -350);
            }
            if(this.arrowLeftPressed)
            {
                me.shoot.setVelocity(-240, -200);//(-240, -350);
            }

            this.destroyProjectil2();

            ui.perdre();
            me.aPressed=false;
        }
    } // FIN DE THROWBONES

    // ********************************* Gestionnaire des effets déclenchés à la mort d'un monstre *********************************

    /**
     *
     * @param {Sprite} object Objet qui saigne
     * @param {function} onComplete Fonction à appeler quand l'anim est finie
     */
    saigne(object,onComplete)
    {
        let me = this;
        me.blood.visible = true;
        me.blood.rotation = Phaser.Math.Between(0,6);
        if(this.isMobilePerso) {
            me.blood.x = Tableau.current.player.body.position.x; // object.x;
            me.blood.y = Tableau.current.player.body.position.y + 64; // object.y;
        }
        else
        {
            me.blood.x = object.x; //
            me.blood.y = object.y; // ;
        }
        me.tweens.add({
            targets:me.blood,
            duration:200,
            displayHeight:
            {
                from:40,
                to:70,
            },
            displayWidth:
            {
                from:40,
                to:70,
            },
            onComplete: function () 
            {
                me.blood.visible = false;
                //onComplete();
            }
        })
    } // FIN DE SAIGNE


    // ********************************* Gestionnaire des effets déclenchés à la mort du joueur *********************************
    //
    /**
     *
     * @param {Sprite} object Objet qui saigne
     * @param {function} onComplete Fonction à appeler quand l'animation est finie
     */
    saignePlayer(object,onComplete)
    {
        let me = this;
        me.blood2.visible = true;
        me.blood2.rotation = Phaser.Math.Between(0,6);
        me.blood2.x = object.x;
        me.blood2.y = object.y + 32;
        me.tweens.add(
            {
            targets:me.blood2,
            duration:200,
            displayHeight:
            {
                from:40,
                to:70,
            },
            displayWidth:
            {
                from:40,
                to:70,
            },
            onComplete: function () 
            {
                me.blood2.visible = false;
                onComplete();
            }
        })
    } // FIN DE SAIGNEPLAYER


    /**
     *
     * @param {Sprite} object Objet qui saigne
     * @param {function} onComplete Fonction à appeler quand l'animation est finie
     */
    saigneMiniBoss(object,onComplete)
    {
        let me = this;
        me.blood.visible = true;
        me.blood.rotation = Phaser.Math.Between(0,6);
        me.blood.x=object.x;
        me.blood.y=object.y;
        me.tweens.add({
            targets:me.blood,
            duration:200,
            displayHeight:
            {
                from:40,
                to:70,
            },
            displayWidth:
            {
                from:40,
                to:70,
            },
            onComplete: function () 
            {
                me.blood.visible = false;
                onComplete();
            }
        })
        me.power = new CollectiblePower(this,Tableau.current.player.body.position.x + 150,Tableau.current.player.body.position.y + 24,"power")
            .setDepth(996);

    } // FIN DE SAIGNEMINIBOSS


    // ********************************* Gestionnaire des effets déclenchés à la destruction d'un vase *********************************
    //
    /**
     *
     * @param {Sprite} object Objet qui saigne
     * @param {function} onComplete Fonction à appeler quand l'animation est finie
     */
    vaseBroke(object) //,onComplete)
    {
        let me = this;
        me.broke.visible = true;
        me.broke.rotation = Phaser.Math.Between(0,6);
        me.broke.x = object.x;
        me.broke.y = object.y;
        
    } // FIN DE VASEBROKE 


    // ********************************* Gestionnaire de collectibilité des ressources (score, equipements...) *********************************
    // OSSEMENTS
    ramasserEtoile (player, star)
    {
        star.disableBody(true, true);
        star.body.destroy();
        star.emit("disabled");
        ui.gagne();

        this.musicOs = this.sound.add('osMus');
        var musicConfig = 
        {
            mute: false,
            volume: 0.3,
            rate : 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay:0,
        }
        this.musicOs.play(musicConfig);

        //va lister tous les objets de la scène pour trouver les étoies et vérifier si elles sont actives
        /*
        let totalActive=0;
        for(let child of this.children.getChildren()){
            if(child.texture && child.texture.key==="star"){
                if(child.active){
                    totalActive++;
                }
            }
        }
        if(totalActive===0){
            this.win();
        }
        */
    }
    // ETOFFES
    ramasserEtoffe (player, etoffes)
    {
        etoffes.disableBody(true, true);
        etoffes.body.destroy();
        //etoffe.emit("disabled");
        ui.ramasser();

        this.music = this.sound.add('tissu');
        var musicConfig = 
        {
            mute: false,
            volume: 0.1,
            rate : 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay:0,
        }
        this.music.play(musicConfig);
    }
    // POWER
    ramasserPower (player, power)
    {
        power.disableBody(true, true);
        power.body.destroy();

        this.playerPower += 1;
        Tableau.current.player.varSpeed += 20;

        this.music = this.sound.add('waow');
        var musicConfig = 
        {
            mute: false,
            volume: 0.3,
            rate : 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay:0,
        }
        this.music.play(musicConfig);

        this.time.addEvent
        ({
            delay: 2000,
            callback: ()=>
            {
                this.win();
            },
            loop: false
        })

    }


    /**
     * Aïeee ça fait mal
     * @param player
     * @param spike
     */
    hitSpike (player, spike)
    {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.scene.restart();

    } // FIN DE HITSPIKE


    miniBossLife(miniBoss)
    {
        this.hpMiniBoss -= 1;
        //console.log(this.hpMiniBoss);
        if(this.hpMiniBoss <= 0)
        {
            ui.gagne2();
            //monster.body.enable = false // Invulnérabilité temporaire
            this.miniBoss.isDead = true; //ok le monstre est mort)
            this.miniBoss.disableBody(true,true);//plus de collisions
            this.miniBoss.body.destroy();
 
            this.saigneMiniBoss(this.miniBoss,function()
            {
                //effets déclenchés à la fin de l'animation
            })
 
            //petit son de mort du monstre
            /*this.music = this.sound.add('splash');
 
            var musicConfig = 
            {
                mute: false,
                volume: 0.3,
                rate : 1,
                detune: 0,
                seek: 0,
                loop: false,
                delay:0,
            }
            this.music.play(musicConfig);*/
        }

    }


    /**
     * Quand on touche un monstre
     * si on le touche par en haut on le tue, sinon c'est lui qui nous tue
     * @param {Player} player
     * @param {Phaser.Physics.Arcade.Sprite} monster
     */
    hitMiniBoss(player, miniBoss)
    {
        if(!this.invicibleForEver)
        {
            let me = this;
     
            //this.blood2.setDepth(996+this.depthConst);
            if(miniBoss.isDead !== true)
            {
                if(Tableau.current.player.falling && player.getBounds().bottom < miniBoss.getBounds().top+30)
                {
                    player.setVelocityY(-600);
                    this.miniBossLife();

                } 
                else
                {
                    me.playerDamage();
                }
            }
        }
    } // FIN DE HITMONSTER


    /**
     * Quand on touche un monstre
     * si on le touche par en haut on le tue, sinon c'est lui qui nous tue
     * @param {Player} player
     * @param {Phaser.Physics.Arcade.Sprite} monster
     */
    hitMonster(player, monster)
    {
        if(!this.invicibleForEver)
        {
            let me = this;

            //this.blood2.setDepth(996);
            if(monster.isDead !== true)
            {
                if(player.body.velocity.y >= 0 && player.getBounds().bottom < monster.getBounds().top+30)
                {
                    this.monsterOfVaseIsDead = true;
                    ui.gagne1();
                    //monster.body.enable = false // Invulnérabilité temporaire
                    monster.isDead = true; //ok le monstre est mort
                    monster.disableBody(true,true);//plus de collisions
                    monster.body.destroy();
    
                    /*this.saigne(monster,function()
                    {
                        //effets déclenchés à la fin de l'animation :)
                    })*/
    
                    //petit son de mort du monstre
                    /*this.music = this.sound.add('splash');

                    var musicConfig =
                    {
                        mute: false,
                        volume: 0.3,
                        rate : 1,
                        detune: 0,
                        seek: 0,
                        loop: false,
                        delay:0,
                    }
                    this.music.play(musicConfig);*/
    
                    player.directionY = 500;
    
                } 
                else
                {
                    me.playerDamage();
                }
            }
        }
    } // FIN DE HITMONSTER


    playerDamage(player,hp)
    {
        if(!this.player.isDead)
        {
            let me = this;
            if(this.lifePoints >= 2)
            {
                ui.perdre1();
                ui.losePV();
                this.shakeCameras();
                me.invincible();
                me.lifePoints -= 1;
                me.InfosLifePoints();
            }
            else if (this.lifePoints < 2) 
            {
                if (!me.player.isDead) 
                {
                    ui.perdre2();
                    this.blood2.setDepth(1000);
                    me.player.isDead = true;
                    me.player.visible = false;

                    me.saignePlayer(me.player, function () 
                    {
                        // à la fin de la petite anim, on relance le jeu
                        me.blood2.visible = false;
                        me.player.anims.play('turn');
                        me.player.isDead = false;
                        me.scene.restart();
                        //console.log('playerDamage(player,hp) -> saigneFini');
                    })

                    this.music = this.sound.add('crack');
                    var musicConfig = 
                    {
                        mute: false,
                        volume: 0.3,
                        rate : 1,
                        detune: 0,
                        seek: 0,
                        loop: false,
                        delay:0,
                    }
                    this.music.play(musicConfig);
        
                    this.cleanStorage();
                    //this.song.stop();
                    me.scene.restart();
    
                }
                this.lifePoints = 3;
            }
        }

    } // FIN DE PLAYERDAMAGE


    playerHealing()
    {
        let me = this;
        if(this.ePressed)
        {
            if(this.lifePoints <=2 && this.oneHeal == false && ui.score >= 20)
            {
                ui.perdre1();
                ui.gagnePV();
                this.startingHealAura();
                me.lifePoints += 1;
                me.InfosLifePoints2();
                this.oneHeal = true;
            }
        }

    } // FIN DE PLAYERHEALING


    shakeCamerasMini()
    {
        this.startingHealAura();
        this.cameras.main.shake(1000, 0.001);
    }
    shakeCameras()
    {
        this.startingDmgAura();
        this.cameras.main.shake(500, 0.005);
    }
    shakeCamerasM()
    {
        this.startingDmgAura();
        this.cameras.main.shake(500, 0.005);

    } // FIN DES SHAKECAMERAS
    

    startingDmgAura()
    {
        this.startAuraDmg = true;
        this.time.addEvent
        ({
            delay: 500,
            callback: ()=>
            {
                this.startAuraDmg = false;
            },
            loop: false
        })
    }
    startingHealAura()
    {
        this.startAuraHeal= true;
        this.time.addEvent
        ({
            delay: 500,
            callback: ()=>
            {
                this.startAuraHeal = false;
            },
            loop: false
        })
    }


    // ********************************* Rend le player invulnérable *********************************
    //
    // pour un évènement à durée courte
    invincible()
    {
        this.invicibleForEver = true;
        this.zombieAlive = false;
        this.time.addEvent
        ({
            delay: 1000,
            callback: ()=>
            {
                this.vulnerable();
            },
            loop: false
        })
    }
    vulnerable()
    {
        this.startAuraDmg = false;
        this.invicibleForEver = false;
        this.zombieAlive = true;
    }
    // pour un évènement à durée moyenne
    invincibleM()
    {
        this.invicibleForEver = true;
        this.zombieAlive = false;
        this.time.addEven
        ({
            delay: 4000,
            callback: ()=>
            {
                this.vulnerableM();
            },
            loop: false
        })
    }
    vulnerableM()
    {
        this.invicibleForEver = false;
        this.zombieAlive = true;
    }
    // pour une durée indéterminée, jusqu'à un déclenchement
    invincibleXXX()
    {
        while(!this.invincibleForEver)
        {
            this.invicibleForEver = true;
            return;
        }
        while(this.zombieAlive)
        {
            this.zombieAlive = false;
            return;
        }
        /*this.time.addEvent
        ({
            delay: 10000000,
            callback: ()=>
            {
                this.invicibleForEver = false;
                this.zombieAlive = true;
                //console.log("vulnerableXXX");
            },
            loop: false
        })*/
    }
    vulnerableXXX()
    {
        while(this.invincibleForEver)
        {
            this.invicibleForEver = false;
            return;
        }
        while(!this.zombieAlive)
        {
            this.zombieAlive = true;
            return;
        }
    }
    // *********************************


    JumpRetomber()
    {
        if(Tableau.current.player.semiMobileY)// || Tableau.player.body.touching.down)
        {
            this.stopTomber = true;
        }
        else
        {
            this.player.directionX = 0;
        }

        if(this.stopTomber && Tableau.current.player.staticY) // this.player.body.blocked.down)
        {
            this.player.directionX = 0;
            this.stopTomber = false;
        }
    } // FIN DE JUMPRETOMBER


    // ********************************* Confirme la destruction du projectil après un délai prédéfini *********************************
    //
    // Instantanément
    destroyProjectil()
    {
        //this.projectilDestroyed = true;
        //this.shoot.move();
        this.time.addEvent
        ({
            delay: 0,//1500,
            callback: ()=>
            {
                //this.shoot.stop();
                this.youCanDestroyIt = true;
            },
            loop: false
        })
    }
    // Après un lapse de temps
    destroyProjectil2()
    {
        this.time.addEvent
        ({
            delay: 1500,
            callback: ()=>
            {
                this.youCanDestroyIt = true;
            },
            loop: false
        })
    }
    // *********************************

    /**
     * Pour reset cette scène proprement
     * @private
     */
    _destroy()
    {
        this.player.stop();
        this.scene.stop();
    }

    /**
     * Pour reset le localStorage
     * @private
     */
    cleanStorage()
    {
        localStorage.removeItem("bougie"); // ,bougieName);
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
    }

    /**
     * Quand on a gagné
     */
    win()
    {
        localStorage.removeItem("checkPoint");

        ui.reset();
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

        Tableau.current._destroy();
        this.game.scene.start(Credits);
        this.scene.start("credit");
        //Tableau.suivant();
    }

    /**
     * Va au tableau suivant
     */
    static suivant()
    {
        let ceSeraLaSuivante=false;
        let nextScene=null;
        if(Tableau.current)
        {
            for(let sc of game.scene.scenes)
            {
                if(sc.scene.key !== "ui")
                {
                    if(!nextScene)
                    {
                        if(ceSeraLaSuivante)
                        {
                            nextScene=sc;
                        }
                        if(sc.scene.key === Tableau.current.scene.key)
                        {
                            ceSeraLaSuivante=true;
                        }
                    }
                }
            }
        }
        if(!nextScene)
        {
            nextScene = game.scene.scenes[0];
        }
        Tableau.goTableau(nextScene);
    }

    static goTableau(tableau)
    {
        if(Tableau.current)
        {
            Tableau.current._destroy();
        }
        //game.scene.start(tableau);
    }


}

/**
 * Le tableau en cours
 * @type {null|Tableau}
 */
Tableau.current=null;