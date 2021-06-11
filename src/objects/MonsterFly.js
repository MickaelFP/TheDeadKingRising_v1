class MonsterFly extends ObjetEnnemi{
    /**
     * Un monstre qui vole et fait des allez -retours
     * @param {Tableau} scene
     * @param x
     * @param y
     */
    constructor(scene, x, y) {
        super(scene, x, y, "monster-fly"); 
        //pas de gravité
        this.body.allowGravity=false;

        this.setDisplaySize(55,51);
        //on réduit un peu la zone de hit
        this.setCollideWorldBounds(true);
        this.setBodySize(this.body.width,this.body.height);
        //this.setOffset(0, 0);
        this.setVelocityX(100);
        this.setBounceX(1);

        this.v = false;
        this.flying = true;
        this.onNeVieQuneFoisCS = true;
        this.unSeulEffect = true;

        this.anims.create({
            key: 'moving',
            frames: this.anims.generateFrameNumbers('monster-fly', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.play('moving', true)

        this.anims.create({
            key: 'movingFast',
            frames: this.anims.generateFrameNumbers('monster-fly', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        });

    }


    update()
    {
        this.animation();
        this.move();
        this.chauveSourieEffectSound();
    }


    chauveSourieEffectSound()
    {
        if(this.isDead && this.onNeVieQuneFoisCS)
        {
            Tableau.current.chauveSourieEffect();
            this.onNeVieQuneFoisCS = false;
            this.unSeulEffect = true;
        }

        if(!this.isDead && this.unSeulEffect)
        {
            if(this.scene.player.x > this.x - 196
                && this.scene.player.x < this.x
                && this.scene.player.y <= this.y + 64
                && this.scene.player.y >= this.y - 64)
            {
                Tableau.current.chauveSourieEffect2();
                this.unSeulEffect = false;
            }
            else if(this.scene.player.x < this.x + 196
                && this.scene.player.x > this.x
                && this.scene.player.y <= this.y + 64
                && this.scene.player.y >= this.y - 64)
            {
                Tableau.current.chauveSourieEffect2();
                this.unSeulEffect = false;
            }
        }
        else if(!this.isDead && !this.unSeulEffect)
        {
            if(this.scene.player.x < this.x + 206
                && this.scene.player.x > this.x + 196)
            {
                this.unSeulEffect = true;
            }
            else if(this.scene.player.x > this.x - 206
                && this.scene.player.x < this.x - 196)
            {
                this.unSeulEffect = true;
            }
            else if(this.scene.player.y > this.y + 64
                || this.scene.player.y < this.y - 64)
            {
                this.unSeulEffect = true;
            }
        }

    }


    move(player)
    {

        if(!this.isDead && !Tableau.current.monsterMoveStop)
        {
            if(this.scene.player.x > this.x - 196 && this.scene.player.x < this.x - 10 && this.scene.player.y <= this.y + 64 && this.scene.player.y >= this.y - 64)
            {;
                this.setVelocityX(-200); // -80*(Math.random()+1.5));
                this.anims.play('movingFast', true)
                this.v = false;
            }
            else if(this.scene.player.x < this.x + 196 && this.scene.player.x > this.x + 10 && this.scene.player.y <= this.y + 64 && this.scene.player.y >= this.y - 64)
            {
                this.setVelocityX(200);
                this.anims.play('movingFast', true)
                this.v = false;
            }
            else if (!this.v)
            {
                this.setVelocityX(100);
                this.anims.play('moving', true)
                this.v = true;
            }
            else
            {
                this.anims.play('moving', true)
            }
        }
        else
        {
            this.setVelocityX(0);
            this.anims.play('moving', true)

        }
    }


    animation()
    {
        if(this.body)
        {
        
            if(this.body.velocity.x < 0)
            {
                this.flipX = false;
                
            }
            else
            {
                this.flipX = true;
            }
        }
    }

    stop()
    {
        this.setVelocityX(0);
        this.setVelocityY(0);
        this.directionY=0;
        this.directionX=0;
    }

}