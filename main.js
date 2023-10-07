let app= new PIXI.Application({width: 800, height: 700, backgroundColor: 0x808080});//创建pixi实例,背景色0x808080为灰色
document.getElementById("center").appendChild(app.view);//把pixi视图挂载到页面上
let sprite = PIXI.Sprite.from('assets/1.png')
sprite.width = 100;
sprite.height = 100;
app.stage.addChild(sprite);
sprite.x=0;
sprite.y=0;
let sprite2 = PIXI.Sprite.from('assets/2.png')
sprite2.width = 100;
sprite2.height = 100;
app.stage.addChild(sprite2);
sprite2.x=100;
sprite2.y=0;

