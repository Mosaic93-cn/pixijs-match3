let app= new PIXI.Application({width: 800, height: 700, backgroundColor: 0x808080});//创建pixi实例,背景色0x808080为灰色
const te1 = PIXI.Texture.from('assets/1.png');
const te2 = PIXI.Texture.from('assets/2.png');
const te3 = PIXI.Texture.from('assets/3.png');
const te4 = PIXI.Texture.from('assets/4.png');//创建纹理对象
document.getElementById("center").appendChild(app.view);//把pixi视图挂载到页面上
let sprNum=0;//精灵数量
function createSprite(type){    //方法:创建新精灵
    sprNum++
    eval("let sprite"+sprNum+";")
    var str1="sprite"+sprNum+"=new PIXI.Sprite(te"+type+");"
    var str2="sprite"+sprNum+".width=100;sprite"+sprNum+".height=100;";
    eval(str1+str2)
}
function setSprite(index,x,y){  //方法:确定精灵位置并挂载到stage上
    eval("sprite"+index+".x="+x+";sprite"+index+".y="+y+";")
    eval("app.stage.addChild(sprite"+index+");")
}
let board_type=[[],[],[],[],[],[],[],[]];//创建数组对象board_type,用于储存棋盘上棋子的样式
let board_index=[[],[],[],[],[],[],[],[]];//创建数组对象board_index,用于储存棋盘上棋子的id

//初始化棋盘
let pis=[1,2,3,4]//所有棋子类型
let cupis=[]//可使用的棋子类型
for(let x=0;x<8;x++){
    for(let y=0;y<7;y++){
        cupis=[1,2,3,4]
        if(board_type[x-2]!=undefined){
            if(board_type[x-2][y]==board_type[x-1][y]){
                cupis.splice(cupis.indexOf(board_type[x-1][y]),1);
            }   //当同一列前两个棋子相同时,在可使用的棋子类型中去掉前两个棋子的棋子类型
        }   
        if(board_type[x][y-2]!=undefined){
            if(board_type[x][y-2]==board_type[x][y-1]){
                cupis.splice(cupis.indexOf(board_type[x][y-1]),1);
            }   //同理去掉同一排前两个相同棋子的棋子类型
        }
        let ptype=cupis[Math.floor(Math.random()*cupis.length)]
        //在当前位置放置随机类型棋子
        board_type[x][y]=ptype
        createSprite(ptype);
        setSprite(sprNum,x*100,y*100)
        board_index[x][y]=sprNum;
    }
}

