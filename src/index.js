import Phaser, { Game, GameObjects } from 'phaser';
import deskImg from "./assets/Screenshot_3.jpg";
import bun from "./assets/bread1.png";
import sausage from "./assets/sausage1.png";
import ketchup from "./assets/ketchup-bottle.png";
import ketchupFill from "./assets/ketchup-bottle-fill.png";
import Point from "./points";

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    

    preload ()
    {

        this.load.image("desk", deskImg);
        this.load.image("ketchup", ketchup);
        this.load.image("ketchupFill", ketchupFill);
        this.load.image("bun", bun);
        this.load.image("sausage", sausage);
        //this.load.image('bunSal', 'assets/bread2.png');
        //this.load.image('bunSalKet', 'assets/bread3.png');
        //this.load.image('bunKet', 'assets/bread4.png');
    }
      
    create ()
    {

        const y = 160;
        let panCounter = 0;
        let sausageCounter = 0;
        let posPan = [new Point(210,y),new Point(260,y),new Point(310,y)];
        let posSausage = [new Point(460,y),new Point(510,y),new Point(560,y)];
        let listenCreated = new Phaser.Events.EventEmitter();
        let sausages = [];
        this.myGroup = this.add.group();
        let insideZone = [];

        

        function changeTexture() {
            this.setTexture('ketchupFill');
        }

        function unchange(){
            this.setTexture('ketchup');
        }
       
        function createEntity(context,type,x,y){
            let entity = context.add.sprite(x, y, type);
            entity.setInteractive(new Phaser.Geom.Rectangle(0, 0, 80, 100), Phaser.Geom.Rectangle.Contains);
            context.input.setDraggable(entity);
            entity.inputEnabled = true;
            return entity;
        }

        function collider(context,type,x,x1,y,y1,positions, counter){
            let createdEntity;
            createdEntity = context.button.on('pointerdown',function(){
                let ent;
                if(counter < 3){
                    if(game.input.mousePointer.x > x && game.input.mousePointer.x < x1){
                        if(game.input.mousePointer.y > y && game.input.mousePointer.y < y1){
                            ent = createEntity(this, type ,positions[counter].getX, positions[counter].getY);
                            counter = counter+1;
                        }
                    }
                }
                return ent;
            },context)
            return createdEntity;
        }

       
        
        //mice position
        this.button = this.add.sprite(300, 200,'desk').setInteractive();
        //debug
        this.button.on('pointerdown',function(){
            console.log("x: "+  game.input.mousePointer.x + "/" + "y: "+game.input.mousePointer.y);
        },this)
        
        
        //GAME ELEMENTS:
        //cooking plate
        var zone = this.add.zone(510,170, 250, 110).setRectangleDropZone(250, 110);
        

        
        //  Just a visual display of the drop zone
        var graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);

        //pan
        collider(this,'bun', 150,340,220,270,posPan,panCounter);
        //Salchicha
        sausages.push(collider(this,'sausage', 400,600,220,270,posSausage,sausageCounter));
        //ketchup-bottle
        let ket = createEntity(this,'ketchup',40,60);
        ket.on('pointerdown',changeTexture).on('pointerup',unchange);



        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        

        this.input.on('dragenter', function (pointer, gameObject, dropZone) {
            if(!insideZone.includes(gameObject) ){
                insideZone.push(gameObject);
                console.log("count: " + insideZone.length);
                graphics.clear();
                graphics.lineStyle(2, 0x00ffff);
                graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
            }
        });
    
        this.input.on('dragleave', function (pointer, gameObject, dropZone) {
            
            let i = insideZone.indexOf(gameObject);
            insideZone.splice(i,1);
            
            if(insideZone.length == 0){
                console.log("count: " + insideZone.length);
                graphics.clear();
                graphics.lineStyle(2, 0xffff00);
                graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
            }
        });





    }

    update(){
        
    }
    
}
 


const config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 600,
    height: 300,
    scene: MyGame,
    transparent: 'true'
};

const game = new Phaser.Game(config);