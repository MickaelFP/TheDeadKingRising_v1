/**
 * Un objet qui écoute les touches du clavier et mouvements sur le pad et qui influent le déplacement du joueur
 */
class GameKeyboard extends Phaser.GameObjects.Container{
    constructor(scene, x, y) {
        super(scene, x, y)
        scene.add.existing(this);

            this.cursors = scene.input.keyboard.createCursorKeys();

            scene.input.keyboard.on('keydown', function(kevent){
                if(Tableau.current && Tableau.current.player)
                {
                    //console.log(kevent.key);
                    switch (kevent.key){
                        case "ArrowRight":
                            if(Tableau.current.player.staticY){
                            Tableau.current.player.directionX = 1;
                            Tableau.current.arrowRightPressed = true;
                            }
                            break;
        
                        case "ArrowLeft":
                            if(Tableau.current.player.staticY){
                            Tableau.current.player.directionX = -1;
                            Tableau.current.arrowLeftPressed = true;
                            }
                            break;
        
                        case "ArrowUp":
                            Tableau.current.arrowUpPressed = true;
                            Tableau.current.keyboardArrowUp = true;
                            break;
        
                        case "ArrowDown":
                            Tableau.current.arrowDownPressed = true;
                            Tableau.current.player.directionX = 0;
                            Tableau.current.player.directionY = 1;
                            Tableau.current.tJAfterPressArrowDown();
                            break;
        
                        case "a":
                            Tableau.current.player.directionX = 0;
                            //Tableau.current.player.directionY = 0;
                            Tableau.current.aPressed = true;
                            break;
                        
                        case "i":
                            Tableau.current.iPressed = true;
                            break;
        
                        case "Control":
                            Tableau.current.ControlPressed = true;
                            break;
        
                        case "e":
                            Tableau.current.ePressed = true;
                            break;
        
                        case "d":
                            Tableau.current.dPressed = true;
                            break;
            
                        case "p":
                            Tableau.current.pPressed = true;
                            break;

                        case "r":
                            Tableau.current.rPressed = true;
                    }
                }
            });

            scene.input.keyboard.on('keyup', function(kevent){
                if(Tableau.current && Tableau.current.player)
                {
                    switch (kevent.key){
                        case "ArrowRight":
                            //Tableau.current.player.directionX = 1;
                            Tableau.current.arrowRightUnpressed = true;
                            Tableau.current.arrowRightPressed = false;
                            Tableau.current.JumpRetomber();
                            break;
        
                        case "ArrowLeft":
                            //Tableau.current.player.directionX = -1;
                            Tableau.current.arrowLeftUnpressed = true;
                            Tableau.current.arrowLeftPressed = false;
                            Tableau.current.JumpRetomber();
                            break;
        
                        case "ArrowUp":
                            Tableau.current.keyboardArrowUp = false;
                            Tableau.current.player.directionY = 0;
                            Tableau.current.arrowUpPressed = false;
                            Tableau.current.firstJump = true;
                            break;
        
                        case "ArrowDown":
                            Tableau.current.arrowDownPressed = false;
                            break;
        
                        case "a":
                            Tableau.current.player.directionX = 0;
                            break;
                        
                        case "i":
                            Tableau.current.iPressed = false;
                            Tableau.current.infosTime = true;
                            break;
                            
                        case "Control":
                            Tableau.current.ControlPressed = false;
                            break;
        
                        case "e":
                            Tableau.current.ePressed = false;
                            Tableau.current.oneHeal = false;
                            break;
        
                        case "d":
                            Tableau.current.dPressed = false;
                            Tableau.current.timingDash = true;
                            break;

                        case "p":
                            Tableau.current.pPressed = false;
                            Tableau.current.pauseTime = true;
                            break;

                        case "r":
                            Tableau.current.rPressed = false;
                    }
                }

            });
        

    }


}