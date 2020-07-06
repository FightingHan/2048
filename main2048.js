var board = []; //4*4数组
var score = 0;//记录总分数
var hasConflicited = [];//记录是否已经叠加过的数组
var rand = [];//记录当前空余的位置下标
var special = {
    2: "2",
    4: "4",
    8: "8",
    16: "16",
    32: "32",
    64: "64",
    128: "128",
    256:  "256",
    512: "512",
    1024: "1024",
    2048:  "2048",
    4096:  "4096"
}

//界面加载初始化函数调用
$(document).ready(function(){
    prepareForMobile();
    newgame();
});

function prepareForMobile(){
    if(documentWidth > 500){
        //debugger;
        cellSideLength = 100;
        cellSpace = 20;
        gridContainerWidth = 500;
    }
    else{
        //debugger;
        $("#grid-container").css("height",gridContainerWidth - 2*cellSpace);
        $("#grid-container").css("width",gridContainerWidth - 2*cellSpace);
        $("#grid-container").css("padding",cellSpace);
        $("#grid-container").css("boder-radius",0.02*gridContainerWidth);

        $(".grid-cell").css("width",cellSideLength);
        $(".grid-cell").css("height",cellSideLength);
        $(".grid-cell").css("border-radius",0.02*cellSideLength);

    }
   
}

//开始新游戏
function newgame(){
    //初始化方格
    init();

    //生成随机数据
    generateOneNumber();
    generateOneNumber();  

}

$(document).keydown(function( evemt){
    switch(event.keyCode){
        case 37://left
            evemt.preventDefault();
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 38://up
            evemt.preventDefault(); 
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 39://right
            evemt.preventDefault();
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);               
            }
            break;
        case 40://down
             evemt.preventDefault();
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);                 
            }
            break;
        default:
            break;
    }
});

//去除手机自己滑动的效果
document.addEventListener('touchmove', function (event) {
    event.preventDefault();
});

//为触控实现操作
document.addEventListener('touchstart',function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchend',function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;
    deltay = endy- starty;
    deltax = endx - startx;
    if(Math.abs(deltax) < documentWidth*0.2 && Math.abs(deltay) < documentWidth*0.2){
        console.log(documentHeight,documentWidth);
        return;
    }
    //在棋格外滑动不进行事件
    var containerY = $('#grid-container').offset().top;
    if(containerY>=starty)
        return true;
    if(Math.abs(deltax) > Math.abs(deltay)){ //水平方向
        if(deltax < 0){//向左
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
        else{//向右
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);               
            }
        }

    }
    else{//垂直方向
        if(deltay > 0){//向下
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);                 
            }
        }else{//向上
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }

    }

});

//初始化棋盘
function init(){
    for(var i = 0;i <= 3; i++){
        for(var j = 0;j <= 3; j++){
            var gridCell = $("#grid-cell-"+ i + "-" + j);
            gridCell.css("top",getPosTop(i));
            gridCell.css("left",getPosLeft(j));

        }
    }
    for(var i = 0;i <= 3; i++){
        board[i] = [];
        hasConflicited[i] = [];
        for(var j = 0;j <= 3; j++){
            board[i][j] = 0;
            hasConflicited[i][j] = false;
        }
    }
    //更新前端
    updateBoardView();
    //分数初始化
    score = 0;
    updateScore(score);
}
//更新棋盘中的数字
function updateBoardView(){
    $(".number-cell").remove();
    for(var i = 0;i <= 3; i++){
        for(var j = 0;j <= 3; j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+ i +'-' + j + '"></div>');
             var theNumberCell = $("#number-cell-" + i + "-" + j);
             //数字为0则隐藏
             if(board[i][j] == 0){
                 theNumberCell.css("width",0);
                 theNumberCell.css("height",0);
                 theNumberCell.css("top",getPosTop(i)+cellSideLength/2);
                 theNumberCell.css("left",getPosLeft(j)+cellSideLength/2);
             }else{
                theNumberCell.css("width",cellSideLength);
                theNumberCell.css("height",cellSideLength);
                theNumberCell.css("top",getPosTop(i));
                theNumberCell.css("left",getPosLeft(j));
                theNumberCell.css("background-color",getNumberBackgroundColor(board[i][j]));
                theNumberCell.css("color",getNumberColor(board[i][j]));
                theNumberCell.text(special[board[i][j].toString()]);
                changeFontSize(i,j);
             }
             hasConflicited[i][j] =  false;
        }
        $(".number-cell").css('line-height',cellSideLength+"px");
        $(".number-cell").css('font-size',0.52*cellSideLength+"px");
        
    }
}
//生成随机数字
function generateOneNumber(){
    //判断还有没有位置
    if(nospace(board,rand)){
        return false;//没有位置了！
    }
    /*随机位置
    var randx = parseInt(Math.floor(Math.random()*4));
    var randy = parseInt(Math.floor(Math.random()*4));
    while(true){
        if(board[randx][randy] == 0){
            break;
        }
        var randx = parseInt(Math.floor(Math.random()*4));
        var randy = parseInt(Math.floor(Math.random()*4));
    }

    //随机数字
    //50%生成2，50%生成4,与0.5比较，大于则生成2，小于生成4
    var randNumber = Math.random() > 0.5? 2 : 4;
    board[randx][randy] = randNumber;//更新board数组
    */
    var randIndex = parseInt(Math.floor(Math.random()*rand.length));
    var randx = rand[randIndex][0];
    var randy = rand[randIndex][1];
    var randNumber = Math.random() > 0.5? 2 : 4;
    board[randx][randy] = randNumber;//更新board数组
    //产生动画效果
    showNumberTitAnimation(randx,randy,randNumber,special);

    rand = [];

    return true;
}


//向左移动处理逻辑
function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }
    for(var i = 0; i < 4;i++){
        for(var j = 1;j < 4;j++){
            if(board[i][j] != 0){
                for(var k = 0;k < j;k++){
                    if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;

                    }
                    else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicited[i][k]){
                        showMoveAnimation(i,j,i,k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        hasConflicited[i][k] = true;
                        score += board[i][k];
                        updateScore(score);
                        break;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;

}
//向右移处理逻辑
function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }
    for(var i = 0;i < 4;i++){
        for(var j = 0;j < 3;j++){
            if(board[i][j] != 0){
                for(var k = 3;k > j ;k--){
                    if(board[i][k] == 0 && noBlockHorizontal(i,j,k,board)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }
                    else if(board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicited[i][j]){
                        showMoveAnimation(i,j,i,k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        hasConflicited[i][k] = true;
                        score += board[i][k];
                        updateScore(score);
                        break;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);   
    return true;
}
//处理向上移动
function moveUp(){
    if(!canMoveUp(board))
        return false;
    else{
        for(var i = 1;i < 4;i++){
            for(var j = 0;j < 4;j++){
                if(board[i][j] != 0){
                    for(var k = 0; k <i ;k++){
                        if(board[k][j] == 0 && noBlockVertical(j,k,i,board)){
                            showMoveAnimation(i,j,k,j);
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            break;
                        }
                        else if(board[k][j] == board[i][j] && noBlockVertical(j,k,i,board) && !hasConflicited[i][j]){
                            showMoveAnimation(i,j,k,j);
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            hasConflicited[k][j] = true;
                            score += board[k][j];
                            updateScore(score);
                            break;
                        }
                    }

                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;

}
//处理向下移动的逻辑
function moveDown(){
    if(!canMoveDown(board))
        return false;
    else{
        for(var i = 0;i < 3;i++){
            for(var j = 0;j < 4;j++){
                if(board[i][j] != 0){
                    for(var k = 3; k > i ;k--){
                        if(board[k][j] == 0 && noBlockVertical(j,i,k,board)){
                            showMoveAnimation(i,j,k,j);
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            break;
                        }
                        else if(board[k][j] == board[i][j] && noBlockVertical(j,i,k,board) && !hasConflicited[i][k]){
                            showMoveAnimation(i,j,k,j);
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            hasConflicited[k][j] = true;
                            score += board[k][j];
                            updateScore(score);
                            break;
                        }
                    }

                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;

}
//判断游戏是否结束
function isGameOver(){
    if(nospace(board,rand) && nomove(board)){
        debugger;
        console.log("gameover!");
        gameOver();
    }
}
//游戏结束处理
function gameOver(){
    alert("Game Is Over!");
}