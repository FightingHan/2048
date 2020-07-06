var documentWidth = window.screen.availWidth;
var documentHeight = window.screen.availHeight;
gridContainerWidth = 0.92 * documentWidth;
cellSideLength = 0.18 * documentWidth;
cellSpace = 0.04 * documentWidth;


function getPosTop(i){
    return (i+1)*cellSpace+i*cellSideLength;
};
function getPosLeft(j){
    return (j+1)*cellSpace+j*cellSideLength;
};

function getNumberBackgroundColor(number){
    switch(number){
        case 2:return "#eee4de";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67c5f";break;
        case 64:return "#edcf72";break;
        case 128:return "#edcc61";break;
        case 256:return "#9c0000";break;
        case 512:return "#33b5e5";break;
        case 1024:return "#09c000";break;
        case 2048:return "#a6c000";break;
        case 4096:return "#a6c000";break;
        case 8192:return "#93c000";break;

    }
    return "black";
}

function getNumberColor(number){
    if(number < 4){
        return "#776e65";
    }
    return "white";
}

function showNumberTitAnimation(i,j,ranNumber,special){
    var numberCell = $("#number-cell-" + i +"-" +j);
    numberCell.css("background-color",getNumberBackgroundColor(ranNumber));
    numberCell.css("color",getNumberColor(ranNumber));
    numberCell.css('line-height',cellSideLength+"px");
    numberCell.css('font-size',0.52*cellSideLength+"px");
    numberCell.text(special[ranNumber.toString()]);
    /*
    jquery的animate函数
    value1 - 传入要改变的动画属性
    value2 - 动画持续的时间
    */
    numberCell.animate({
        width: cellSideLength+"px",
        height: cellSideLength+"px",
        top: getPosTop(i),
        left: getPosLeft(j)
    },100);

}
function showMoveAnimation(fromx,fromy,tox,toy){
    var numberCell = $("#number-cell-" + fromx +"-" +fromy);
    numberCell.animate({
        top: getPosTop(tox),
        left: getPosLeft(toy)
    },200);
}

//判断是否可以向左移动
function canMoveLeft(board){
    for(var i = 0; i < 4;i++){
        for(var j = 1;j < 4;j++){
            if(board[i][j] != 0)
                if(board[i][j-1] == 0 || board[i][j-1] == board[i][j])
                    return true;
        }
    }
    return false;
}

//判断是否可以向下移动
function canMoveDown(board){
    for(var i = 0;i < 3;i++){
        for(var j = 0;j < 4;j++){
            if(board[i][j] != 0)
                if(board[i+1][j] == 0 || board[i+1][j] == board[i][j])
                    return true;
        }
    }
    return false;
}

//判断是否可以向上移动
function canMoveUp(board){
    for(var i = 1;i < 4;i++){
        for(var j = 0; j<4; j++){
            if(board[i][j] != 0)
                if(board[i-1][j] == 0 || board[i-1][j] == board[i][j])
                    return true;
        }
    }
    return false;
}

//判断是否可以向右移动
function canMoveRight(board){
    for(var i = 0;i < 4;i++){
        for(var j = 0;j < 3;j++){
            if(board[i][j] != 0){
                if(board[i][j+1] == 0 || board[i][j] == board[i][j+1])
                    return true;
            }
        }
    }
    return false;
}

//判断第y列垂直方向能否移动，从fromx行到tox行方向向下
function noBlockVertical(y,fromx,tox,board){
    for(var z = fromx+1;z < tox;z++){
        if(board[z][y] != 0)
            return false;
    }
    return true;
}

//判断第x行水平方向能否移动，从fromy列到toy列,方向向右
function noBlockHorizontal(x,fromy,toy,board){
    for(var z = fromy + 1;z < toy;z++){
        if(board[x][z] != 0)
            return false;
    }
    return true;
}

//判断棋盘上是否还有位置可以生成数字
function nospace(board,rand){
    var z = 0;
    for(var i = 0;i <= 3; i++){
        for(var j = 0;j <= 3; j++){
            if(board[i][j] == 0){
                rand[z] = [i,j];
                z++;
            }
        }
    }
    if(z != 0)
        return false;
    return true;
}
//判断还能否移动
function nomove(board){

    if(canMoveDown(board) ||
        canMoveLeft(board) ||
        canMoveRight(board) ||
        canMoveUp(board)){
        debugger;
        return false;
    }
    else{
        return true;
    }
}
//更新分数
function updateScore(score){
    $("#score").text(score);
}
function changeFontSize(i,j){
    var hdWidth = 100;
    var textWidth = $("#number-cell-" + i + "-" + j).offsetWidth;
    var scale = hdWidth / textWidth;
    $("#number-cell-" + i + "-" + j).css("fontSize" ,scale * 100 + '%');
}