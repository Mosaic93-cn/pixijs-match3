
const app = new PIXI.Application({ width: 800, height: 700, backgroundColor: 0x808080 });
import '/js/ref/TweenMax.min.js'

//创建pixi实例,背景色0x808080为灰色
// 引入 Tween 功能
console.log("加载中");

app.eventMode = true;
const assets=PIXI.Assets;
const te1 = await assets.load('assets/1.png');
const te2 = await assets.load('assets/2.png');
const te3 = await assets.load('assets/3.png');
const te4 = await assets.load('assets/4.png');//创建纹理对象

const eSpriteGlow = new PIXI.ColorMatrixFilter();
eSpriteGlow.matrix = [
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0
];  //消除中的精灵滤镜默认值




console.log("加载完成");

document.getElementById("center").appendChild(app.view);//把pixi视图挂载到页面上
let sprNum=-1;//新精灵的下标
function createSprite(type, x, y) {
    sprNum++;
    let sprite;
    switch (type) {
        case 1:
            sprite = new PIXI.Sprite(te1);
            break;
        case 2:
            sprite = new PIXI.Sprite(te2);
            break;
        case 3:
            sprite = new PIXI.Sprite(te3);
            break;
        case 4:
            sprite = new PIXI.Sprite(te4);
            break;
        default:
            sprite = new PIXI.Sprite(te1);
    }

    sprite.width = 0; // 初始宽度为0，用于放大效果
    sprite.height = 0; // 初始高度为0，用于放大效果
    sprite.anchor.set(0.5);
    sprite.x = x + 50;
    sprite.y = y + 50;
    sprite.alpha = 0; // 初始透明度为0，用于淡入效果
    sprite.eventMode = 'static';
    sprite.name = sprNum;
    sprite.on("click", onClick);
    sprite.on("pointerdown", pointerdown);
    sprite.on("pointerup", pointerup);
    sprite.on("pointerover", pointerover);
    sprite.on("pointerleave", pointerleave);

    // 创建摇摆动画
    TweenMax.fromTo(sprite, 0.5, { rotation: -15 }, {rotation: 0 });

    // 创建放大效果动画
    TweenMax.to(sprite, 0.5, { width: 100, height: 100 });

    // 创建淡入效果动画
    TweenMax.fromTo(sprite, 1, { alpha: 0 } , { alpha: 1 });

    app.stage.addChild(sprite);
}


function onClick(){
    console.log(this.name);
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
/**
 * 移动棋子:
 * 鼠标按下时记录当前所在棋子
 * 鼠标离开当前棋子时记录所在棋子
 * 交换两个棋子的位置
 */



let isCanCommute=true;
let isDown = false;   //鼠标是否按下
let downIndex;      //鼠标按下时所在的棋子
let overIndex;        //鼠标按下时移动进入的新棋子


function pointerdown(e) {    //鼠标按下时 
    isDown = true;    //鼠标状态设置为按下
    downIndex =this.name ;  //记录所在棋子
    
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
if (isDown&&isCanCommute) {     //判断鼠标是否按下
        isCanCommute=false;
        isDown = false;
        // 获取当前鼠标按下的精灵
        const target = e.target;
        overIndex =this.name;  //记录新棋子
        // 输出按下时的精灵对象
        console.log('按下时的棋子:',downIndex);
        console.log("鼠标移入的新棋子:"+overIndex);
        if(commute(downIndex,overIndex)){    //判断是否成功交换
            console.log("成功交换");
            if(eliminable()){    //判断交换后是否可以消除
                console.log("可以消除");
                setTimeout(()=>{
                    eliminate()
                },500)
                //如果可以消除,等待0.5s执行清除程序
            }else{
                console.log("不可以消除");
                setTimeout(()=>{
                    commute(overIndex,downIndex);
                },500)
                //如果不可以消除,等待0.5s两个棋子返回原位
            }
        }
}
}


function commute(index1,index2){//交换棋子
    isCanCommute=false;
    let sprite1 = app.stage.getChildByName(index1);
    let sprite2 = app.stage.getChildByName(index2);
    let position1 = { x: sprite1.x, y: sprite1.y };
    let position2 = { x: sprite2.x, y: sprite2.y };

    if (position1.x != position2.x && position1.y != position2.y) {
        return false;
    } else if (position1.x != position2.x) {
        // 创建 Tween 动画来平滑地移动 sprite1 和 sprite2 的 x 坐标
        const sprite1Tween = new TweenMax.to(sprite1, 0.2, { x: position2.x, ease: Power0.easeNone, onComplete: () => { isCanCommute = true; } });
        const sprite2Tween = new TweenMax.to(sprite2, 0.2, { x: position1.x, ease: Power0.easeNone });
    } else {
        // 创建 Tween 动画来平滑地移动 sprite1 和 sprite2 的 y 坐标
        const sprite1Tween = new TweenMax.to(sprite1, 0.2, { y: position2.y, ease: Power0.easeNone, onComplete: () => { isCanCommute = true; } });
        const sprite2Tween = new TweenMax.to(sprite2, 0.2, { y: position1.y, ease: Power0.easeNone });
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
/**
 * 消除棋子
 * 
 */
var needToClear;
//棋子消除
function eliminate() {   
    console.log('eliminate');
    needToClear = [];
    var xed = []; //已经确定在x轴有相连的棋子不会重复测试
    var yed = []; //已经确定在y轴有相连的棋子不会重复测试
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 7; j++) {
            if (xed.indexOf('p' + i + j) == -1 && j + 2 < 7) {
                if (board_type[i][j] == board_type[i][j + 1] && board_type[i][j + 1] == board_type[i][j + 2]) {//横向三个相连
                    if (j + 3 < 7 && board_type[i][j] == board_type[i][j + 3]) {//横向四个相连
                        if (j + 4 < 7 && board_type[i][j] == board_type[i][j + 4]) {//横向五个相连
                            needToClear.push(['p' + i + j, 'p' + i + (j + 1), 'p' + i + (j + 2), 'p' + i + (j + 3), 'p' + i + (j + 4)])
                            xed.push('p' + i + j, 'p' + i + (j + 1), 'p' + i + (j + 2), 'p' + i + (j + 3), 'p' + i + (j + 4))   //把确定好的加入到xed
                        } else {
                            needToClear.push(['p' + i + j, 'p' + i + (j + 1), 'p' + i + (j + 2), 'p' + i + (j + 3)])
                            xed.push('p' + i + j, 'p' + i + (j + 1), 'p' + i + (j + 2), 'p' + i + (j + 3))
                        }
                    } else {
                        needToClear.push(['p' + i + j, 'p' + i + (j + 1), 'p' + i + (j + 2)])
                        xed.push('p' + i + j, 'p' + i + (j + 1), 'p' + i + (j + 2))
                    }
                }
            }
            if (yed.indexOf('p' + i + j) == -1 && i + 2 < 8) {
                if (board_type[i][j] == board_type[i + 1][j] && board_type[i + 1][j] == board_type[i + 2][j]) {//纵向三个相连
                    if (i + 3 < 8 && board_type[i][j] == board_type[i + 3][j]) {//纵向四个相连
                        if (i + 4 < 8 && board_type[i][j] == board_type[i + 4][j]) {//纵向五个相连
                            needToClear.push(['p' + i + j, 'p' + (i + 1) + j, 'p' + (i + 2) + j, 'p' + (i + 3) + j, 'p' + (i + 4) + j])
                            yed.push('p' + i + j, 'p' + (i + 1) + j, 'p' + (i + 2) + j, 'p' + (i + 3) + j, 'p' + (i + 4) + j)   //把确定好的加入到yed
                        } else {
                            needToClear.push(['p' + i + j, 'p' + (i + 1) + j, 'p' + (i + 2) + j, 'p' + (i + 3) + j])
                            yed.push('p' + i + j, 'p' + (i + 1) + j, 'p' + (i + 2) + j, 'p' + (i + 3) + j)
                        }
                    } else {
                        needToClear.push(['p' + i + j, 'p' + (i + 1) + j, 'p' + (i + 2) + j])
                        yed.push('p' + i + j, 'p' + (i + 1) + j, 'p' + (i + 2) + j)
                    }
                }
            }
        }
    }
    if(needToClear.length > 0){
        
        console.log("需要被清除的棋子:");
        console.log(needToClear);
        needToClear.forEach(coords => {
            coords.forEach(coord => {
                const [x, y] = coord.substring(1).split('').map(Number);
                const spriteIndex = board_index[x][y];
                const sprite = app.stage.getChildByName(spriteIndex);
                if (sprite) {
                    sprite.filters = [eSpriteGlow];   //给需要消除的棋子添加滤镜
                    TweenMax.to(eSpriteGlow.matrix,0.5,[
                        1, 0, 0, 0, 0,
                        0, 1, 0, 0, 0,
                        0, 0, 1, 0, 0,
                        0.4, 0, 0, 1, 0
                    ]
                    ,{
                        onComplete: function () {
                            eSpriteGlow.matrix=[
                                1, 0, 0, 0, 0,
                                0, 1, 0, 0, 0,
                                0, 0, 1, 0, 0,
                                0, 0, 0, 1, 0]
                            },
                    })  
                    //用TweenMax修改滤镜,制作动画
                    TweenMax.to(sprite.scale,0.2,{ x: 1.1, y:1.1 });
                    setTimeout(()=>{
                        // 创建 TweenMax 动画来实现抖动、弹性缩小和逐渐淡出
                        TweenMax.to(sprite.scale, 0.3, { x: 0, y: 0 });
                        TweenMax.to(sprite, 0.3, { rotation: 10, repeat: 2, yoyo: true, ease: Power0.easeNone });
                        TweenMax.to(sprite, 0.3, { alpha: 0, onComplete: () => {
                            // 动画完成后移除精灵
                            app.stage.removeChild(sprite);
                        } });
                        // 清空棋盘上的数据
                        board_index[x][y] = null;
                        board_type[x][y] = null;
                    },200)
                }
            });
        });
        setTimeout(spriteDown(),300)
}
    
}
function spriteDown() {
    let hasMoved = false;
    for (let x = 0; x < 8; x++) {
        for (let y = 6; y >= 0; y--) {
            if (board_index[x][y] === null) {
                for (let ny = y - 1; ny >= 0; ny--) {
                    if (board_index[x][ny] !== null) {
                        const spriteIndex = board_index[x][ny];
                        const sprite = app.stage.getChildByName(spriteIndex);
                        board_index[x][ny] = null;
                        board_index[x][y] = spriteIndex;
                        board_type[x][y] = board_type[x][ny];
                        board_type[x][ny] = null;
                        const newY = y * 100 + 50;
                        TweenMax.to(sprite, 0.5, {
                            y: newY,
                            ease: Bounce.easeOut,
                            onComplete: () => {
                                if (!hasMoved) {
                                    hasMoved = true;
                                }
                            }
                        });
                        break;
                    }
                }
            }
        }
    }
    setTimeout(spriteAdd(),100)
}

function spriteAdd() {  //棋子添加
    const emptySlots = [];
    for (let x = 0; x < 8; x++) {
        if (board_type[x][0] === null) {
            emptySlots.push(x);
        }
    }

    if (emptySlots.length !== 0) {
        emptySlots.forEach(x => {
            const y = 0;
            const randomType = pis[Math.floor(Math.random() * pis.length)];
            createSprite(randomType, x * 100, y * 100);
            board_type[x][y] = randomType;
            board_index[x][y] = sprNum;
        });
    } 
    setTimeout(()=>{
        switch(canContinue()){
            case 0:
                setTimeout(()=>{
                    spriteDown()
                },150)
                break;
            case 1:
                setTimeout(()=>{
                    eliminate()
                },500)
                break;
            default:
                break;
            }
    },100)

}
function canContinue() {
    // 检查是否还有可以消除的棋子或空位
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 7; y++) {
            if (board_type[x][y] === null) {
                return 0; // 还有空位，可以继续添加精灵
            }

        }
    }    
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 7; y++) {
            if (x >= 2 && board_type[x][y] === board_type[x - 1][y] && board_type[x][y] === board_type[x - 2][y]) {
                return 1; // 还有可以消除的横向相同棋子
            }
            if (y >= 2 && board_type[x][y] === board_type[x][y - 1] && board_type[x][y] === board_type[x][y - 2]) {
                return 1; // 还有可以消除的纵向相同棋子
            }

        }
    }
    return 2; // 没有空位，也没有可以消除的棋子，不再继续
}
