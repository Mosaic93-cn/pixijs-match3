let app= new PIXI.Application({width: 800, height: 700, backgroundColor: 0x808080});//创建pixi实例,背景色0x808080为灰色
const te1 = PIXI.Texture.from('assets/1.png');
const te2 = PIXI.Texture.from('assets/2.png');
const te3 = PIXI.Texture.from('assets/3.png');
const te4 = PIXI.Texture.from('assets/4.png');//创建纹理对象
document.getElementById("center").appendChild(app.view);//把pixi视图挂载到页面上
let sprNum=0;//精灵数量
function createSprite(type){    //方法:创建新精灵并挂载到stage上
    sprNum++
    eval("let sprite"+sprNum+";")
    var str1="sprite"+sprNum+"=new PIXI.Sprite(te"+type+");"
    var str2="sprite"+sprNum+".width=100;sprite"+sprNum+".height=100;";
    var str3="app.stage.addChild(sprite"+sprNum+");"
    eval(str1+str2+str3)
}
createSprite(1);
function setSprite(index,x,y){
    eval("sprite"+index+".x="+x+";sprite"+index+".y="+y+";")
}
setSprite(1,0,100);
let board_type=new Map();//创建map对象board_type,用于储存棋盘上棋子的样式
let board_index=new Map();//创建map对象board_index,用于储存棋盘上棋子的id
for(let x=0;x<7;x++){
    for(let y=0;y<6;y++){
        board.set(x+","+y,0)
    }
}
console.log(board);