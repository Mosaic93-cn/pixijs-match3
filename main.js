let app= new PIXI.Application({width: 800, height: 700, backgroundColor: 0x808080});//创建pixi实例,背景色0x808080为灰色
app.eventMode = true;
const te1 = PIXI.Texture.from('assets/1.png');
const te2 = PIXI.Texture.from('assets/2.png');
const te3 = PIXI.Texture.from('assets/3.png');
const te4 = PIXI.Texture.from('assets/4.png');//创建纹理对象
for(let i=1;i<5;i++){
    eval("te"+i+".baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;")   //像素化纹理缩放模式
}
document.getElementById("center").appendChild(app.view);//把pixi视图挂载到页面上
let sprNum=-1;//新精灵的下标
function createSprite(type,x,y){    //方法:创建新精灵
    sprNum++
    let sprite;
    switch(type){
        case 1:sprite=new PIXI.Sprite(te1);break;
        case 2:sprite=new PIXI.Sprite(te2);break;
        case 3:sprite=new PIXI.Sprite(te3);break;
        case 4:sprite=new PIXI.Sprite(te4);break;
        default:sprite=new PIXI.Sprite(te1);
    }
    sprite.width=100;//确定精灵大小
    sprite.height=100;
    sprite.anchor.set(0.5);
    sprite.x=x+50;//确定精灵位置
    sprite.y=y+50;     
    sprite.eventMode = 'static';//设置互动监听
    sprite.on("pointerdown",pointerdown)
    sprite.on("pointerup",pointerup)
    sprite.on("pointerover",pointerover)
    sprite.on("pointerleave",pointerleave)
    app.stage.addChild(sprite);
}

let board_type=[[],[],[],[],[],[],[],[]];//创建数组对象board_type,用于储存棋盘上棋子的样式
let board_index=[[],[],[],[],[],[],[],[]];//创建数组对象board_index,用于储存棋盘上棋子的id

//初始化棋盘
const pis=[1,2,3,4]//所有棋子类型
let cupis=[]//可使用的棋子类型
for(let y=0;y<7;y++){
    for(let x=0;x<8;x++){
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
        createSprite(ptype,x*100,y*100);
        board_index[x][y]=sprNum;
    }
}
console.log(board_type);
console.log(board_index);

/**
 * 移动棋子:
 * 鼠标按下时记录当前所在棋子
 * 鼠标离开当前棋子时记录所在棋子
 * 交换两个棋子的位置
 */
let isDown = false;   //鼠标是否按下
let downIndex;      //鼠标按下时所在的棋子
let overIndex;        //鼠标按下时移动进入的新棋子

function pointerdown(e) {     //鼠标按下时
    isDown = true;    //鼠标状态设置为按下
    downIndex =app.stage.getChildIndex(e.target) ;  //记录所在棋子
 }
 function pointerup() {     //鼠标抬起时
    isDown = false;    //鼠标状态设置为抬起
 }
function pointerleave() {    //鼠标离开时
    setTimeout(()=>{
        isDown = false;    //鼠标状态设置为抬起
    }
    ,10)
}
function pointerover(e) {    //鼠标移入时
   if (isDown) {     //判断鼠标是否按下
       isDown = false;
       // 获取当前鼠标按下的精灵
       const target = e.target;
       overIndex =app.stage.getChildIndex(e.target);  //记录新棋子
       // 输出按下时的精灵对象
       console.log('按下时的棋子:',downIndex);
       console.log("鼠标移入的新棋子:"+overIndex);
       if(commute(downIndex,overIndex)){    //判断是否成功交换
           console.log("成功交换");
           if(eliminable()){    //判断交换后是否可以消除
               console.log("可以消除");
           }else{
            console.log("不可以消除");
            setTimeout(()=>{commute(overIndex,downIndex)},500)
              //如果不可以消除,等待0.5s两个棋子返回原位
           }
       }
   }
}
let commuteAni;
function commute(index1,index2){//交换棋子
    let sprite1=app.stage.getChildAt(index1);
    let sprite2=app.stage.getChildAt(index2);
    let position1={x:sprite1.position._x,y:sprite1.position._y}
    let position2={x:sprite2.position._x,y:sprite2.position._y}
    if(position1.x!=position2.x&&position1.y!=position2.y){   //如果x/y都不相等说明没有正常交换
        return false;
    }else if(position1.x!=position2.x){      //x不相等修改x
        let s1speed=(sprite2.x-sprite1.x)/10;
        let s2speed=-s1speed;
        commuteAni=setInterval(()=>{
            sprite1.x+=s1speed
            sprite2.x+=s2speed;
            if(sprite1.x==position2.x){
                clearInterval(commuteAni);
            }

        },17)
    }else{  //y不相等修改y
        let s1speed=(sprite2.y-sprite1.y)/10;
        let s2speed=-s1speed;
        commuteAni=setInterval(()=>{
            sprite1.y+=s1speed;
            sprite2.y+=s2speed;
            if(sprite1.y==position2.y){
                clearInterval(commuteAni);
            }
        },17)
    }
    //根据下标更换board_type和board_index中棋子位置
    let i1,j1,i2,j2;
    for(let i=0;i<board_index.length;i++){
        for(let j=0;j<board_index[i].length;j++){
            if(board_index[i][j]==index1){
                i1=i;
                j1=j;
                break;
            }
        }
    }
    for(let i=0;i<board_index.length;i++){
        for(let j=0;j<board_index[i].length;j++){
            if(board_index[i][j]==index2){
                i2=i;
                j2=j;
                break;
            }
        }
    }
    let board_type1=board_type[i1][j1];
    board_type[i1][j1]=board_type[i2][j2];
    board_type[i2][j2]=board_type1;
    let board_index1=board_index[i1][j1];
    board_index[i1][j1]=board_index[i2][j2];
    board_index[i2][j2]=board_index1;
    return true;
}
function eliminable(){  //判断有无可以消除的棋子
    for(let y=0;y<7;y++){
        for(let x=0;x<8;x++){
            if(board_type[x-2]!=undefined){
                if(board_type[x-2][y]==board_type[x-1][y]&&board_type[x-1][y]==board_type[x][y]){
                    return true;
                }   
            }   
            if(board_type[x][y-2]!=undefined){
                if(board_type[x][y-2]==board_type[x][y-1]&&board_type[x][y-1]==board_type[x][y]){
                    return true;
                }
            }
        }
    }
    return false;
}