const start = window.performance.now(); //시간 측정 시작

//박스 관리를 위한 클래스 구현
class Box {
    constructor (isDrag, width,height,left,right,top,bottom){
        this.isDrag = isDrag;
        this.width = width;
        this.height = height;
        this.left =left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }
}
//가로 블록의 충돌 검사
//가까운 장애물의 데이터를 가져와 움직이는 거리를 제한
function aColidesWithBX(diffX,endOfXPoint,boxA,boxB,boxC,moveBox){
    var leftBox = new Box();
    var rightBox = new Box();
    leftBox.right = 0;
    rightBox.left = endOfXPoint;
    for(const colide of boxB){
        if(boxA.top > colide.top && boxA.top < colide.bottom ||
            boxA.bottom > colide.top && boxA.bottom < colide.bottom){

                if(colide.right <= boxA.left &&
                    colide.right - boxA.left >= leftBox.right - boxA.left){
                    leftBox = colide;
                }
                if(colide.left >= boxA.right && 
                    colide.left - boxA.right <= rightBox.left - boxA.right){
                    rightBox = colide;
                }
                const leftCrashPoint = leftBox.right;
                const rightCrashPoint = rightBox.left - boxA.width;
                if( rightBox.left == endOfXPoint && moveBox == box)
                    moveBox.style.left =`${Math.min(Math.max(leftCrashPoint, boxA.left+diffX), endOfXPoint)}px`;
                else
                    moveBox.style.left =`${Math.min(Math.max(leftCrashPoint, boxA.left+diffX), rightCrashPoint)}px`;
            }  
    }
    for(const colide of boxC){
        if(colide != boxA && colide.top == boxA.top){
            if(colide.right <= boxA.left && 
                colide.right - boxA.left >= leftBox.right - boxA.left)
                leftBox =colide;
            if(colide.left >= boxA.right && 
                colide.right - boxA.left >= leftBox.right - boxA.left)
                rightBox =colide;

            const leftCrashPoint = leftBox.right;
            const rightCrashPoint = rightBox.left - boxA.width;
            if( rightBox.left == endOfXPoint && moveBox == box)
                moveBox.style.left =`${Math.min(Math.max(leftCrashPoint, boxA.left+diffX), endOfXPoint)}px`;
            else
                moveBox.style.left =`${Math.min(Math.max(leftCrashPoint, boxA.left+diffX), rightCrashPoint)}px`;
        }
    }
    
}
//세로 블록의 충돌 검사
//가까운 장애물의 데이터를 가져와 움직이는 거리를 제한
function aColidesWithBY(diffY,endOfYPoint,boxA,boxB,boxC,moveBox){
    
    var topBox = new Box();
    var bottomBox = new Box();
    topBox.bottom = 0;
    bottomBox.top = endOfYPoint;
    for(const colide of boxB){
        if(boxA.left > colide.left && boxA.left < colide.right ||
            boxA.right > colide.left && boxA.right < colide.right){
                if(colide.bottom <= boxA.top &&
                    colide.bottom - boxA.top >= topBox.bottom - boxA.top){
                    topBox = colide;
                }
                if(colide.top >= boxA.bottom && 
                    colide.top - boxA.bottom <= bottomBox.top - boxA.bottom){
                    bottomBox = colide;
                }
                
                const topCrashPoint = topBox.bottom;
                const bottomCrashPoint = bottomBox.top - boxA.height;
                moveBox.style.top =`${Math.min(Math.max(topCrashPoint, boxA.top+diffY), bottomCrashPoint)}px`;
            }  
    }
    for(const colide of boxC){
        if(colide != boxA && colide.left == boxA.left){
            if(colide.bottom <= boxA.top &&
                colide.bottom - boxA.top >= topBox.bottom - boxA.top){
                topBox = colide;
            }
            if(colide.top >= boxA.bottom && 
                colide.top - boxA.bottom <= bottomBox.top - boxA.bottom){
                bottomBox = colide;
            }
            const topCrashPoint = topBox.bottom;
            const bottomCrashPoint = bottomBox.top - boxA.height;
            moveBox.style.top =`${Math.min(Math.max(topCrashPoint, boxA.top+diffY), bottomCrashPoint)}px`;
        }
    }
}

//설치된 블록 데이터를 가져오기
const container = document.querySelector(".area");
const box = container.querySelector(".area__box");
const yBox1 = container.querySelectorAll(".yBox1");
const xBox1 = container.querySelectorAll(".xBox1");

//맵 데이터의 폭과 높이 값을 저장
const {width:containerWidth, height:containerHeight} = container.getBoundingClientRect();

//세로 블록 데이터를 클래스에 저장
let yBox = new Array;
var i =0;
for(const boxs of yBox1){
    
    if(boxs != null){
        const {width:boxsWidth, height:boxsHeight} = boxs.getBoundingClientRect();
        yBox[i++] =new Box(false,boxsWidth,boxsHeight,boxs.offsetLeft,boxs.offsetLeft + boxsWidth,
            boxs.offsetTop, boxs.offsetTop + boxsHeight);

    }

}

//가로 블록의 데이터를 클래스에 저장 빨간 블록 포함
let xBox = new Array;
var j =0;
for(const boxs of xBox1){
    if(j == 0){
        const {width:boxWidth, height:boxHeight} = box.getBoundingClientRect();
        xBox[0] = new Box(false,boxWidth,boxHeight,box.offsetLeft,box.offsetLeft + boxWidth,
            box.offsetTop, box.offsetTop + boxHeight);
        j++;
    }

    if(boxs != null){
        const {width:boxsWidth, height:boxsHeight} = boxs.getBoundingClientRect();
        xBox[j++] =new Box(false,boxsWidth,boxsHeight,boxs.offsetLeft,boxs.offsetLeft + boxsWidth,
            boxs.offsetTop, boxs.offsetTop + boxsHeight);
    }


}

//빨간 블록을 마우스로 클릭 했을 때 드래그 활성화
box.addEventListener("mousedown", (e) => {
    xBox[0].isDrag = true;
    originX = e.clientX;
    originY = e.clientY;
});

//세로 블록을 마우스로 클릭 했을 때 드래그 활성화
for(const cybox of yBox){
    
    if(yBox1[yBox.indexOf(cybox)] != null){
        yBox1[yBox.indexOf(cybox)].addEventListener("mousedown", (e) => {
            cybox.isDrag = true;
            originX = e.clientX;
            originY = e.clientY;
        });
    }
}
//가로 블록을 마우스로 클릭 했을 때 드래그 활성화
//빨간 블록으로 인해 인덱스에 차이가 생김
for(const cxbox of xBox){

    if(xBox1[xBox.indexOf(cxbox) -1] != null && xBox.indexOf(cxbox)>0){
        xBox1[xBox.indexOf(cxbox) -1].addEventListener("mousedown", (e) => {
            console.log(xBox.indexOf(cxbox) -1);
            cxbox.isDrag = true;
            originX = e.clientX;
            originY = e.clientY;
        });
    }
}
//마우스를 땟을 때 블록의 현재 위치를 클래스에 재저장
document.addEventListener("mouseup", (e) => {
    var j=0;
    for(const xboxs of xBox){
        xboxs.isDrag =false;
        if(j == 0){
            xboxs.left = box.offsetLeft;
            xboxs.right = box.offsetLeft + box.getBoundingClientRect().width;
            xboxs.top = box.offsetTop;
            xboxs.bottom = box.offsetTop + box.getBoundingClientRect().height;
            j++;
        }
        else{
            xboxs.left = xBox1[j-1].offsetLeft;
            xboxs.right = xBox1[j-1].offsetLeft + xBox1[j-1].getBoundingClientRect().width;
            xboxs.top = xBox1[j-1].offsetTop;
            xboxs.bottom = xBox1[j-1].offsetTop + xBox1[j-1].getBoundingClientRect().height;
            j++;
        }
    
    }
    var i =0;
    for(const yboxs of yBox){
       
        yboxs.isDrag =false;

        yboxs.left = yBox1[i].offsetLeft;
        yboxs.right = yBox1[i].offsetLeft + yBox1[i].getBoundingClientRect().width;
        yboxs.top = yBox1[i].offsetTop;
        yboxs.bottom = yBox1[i].offsetTop + yBox1[i].getBoundingClientRect().height;

        i++;
    }
    //블록이 탈출 했을 때 클리어 알람창을 출력하고 메인으로 이동
    if(box.offsetLeft == containerWidth){
        const end = window.performance.now(); //시간 측정 종료
        const time = end - start;
        if(time/1000<=10)
            alert("클리어 타임 : " + Math.floor(time/1000) +"초 ☆ ☆ ☆");
        else if(time/1000<=20)
            alert("클리어 타임 : " + Math.floor(time/1000) +"초 ☆ ☆");
        else if(time/1000<=30)
            alert("클리어 타임 : " + Math.floor(time/1000) +"초 ☆");
        else
            alert("클리어 타임 : " + Math.floor(time/1000) +"초");

        var stage = document.title;
        localStorage.setItem(stage ,Math.floor(time/1000) );
        
    
        location.href="Main.html";
    }
    
});


//마우스 클릭으로 각 블록의 드래그를 활성화 시키고 이동 구현
document.addEventListener("mousemove", (e) => {
    if(xBox[0].isDrag){
        const diffX = e.clientX - originX;
        const endOfXPoint = containerWidth;
        box.style.left = `${Math.min(Math.max(0, xBox[0].left+diffX), endOfXPoint)}px`;
        
        aColidesWithBX(diffX,containerWidth,xBox[0],yBox,xBox,box);

    }

    for(const xboxs of xBox){
        if(xboxs.isDrag && xBox.indexOf(xboxs)>0){
            const diffX = e.clientX - originX;
            const endOfXPoint = containerWidth - xboxs.width;
            xBox1[xBox.indexOf(xboxs)-1].style.left = `${Math.min(Math.max(0, xboxs.top + diffX), endOfXPoint)}px`;
    
            aColidesWithBX(diffX,containerWidth,xboxs,yBox,xBox,xBox1[xBox.indexOf(xboxs)-1]);
        }

    }

    for(const yboxs of yBox){
        if(yboxs.isDrag){
            const diffY = e.clientY - originY;
            const endOfYPoint = containerHeight - yboxs.height;
            yBox1[yBox.indexOf(yboxs)].style.top = `${Math.min(Math.max(0, yboxs.top + diffY), endOfYPoint)}px`;
    
            aColidesWithBY(diffY,containerHeight,yboxs,xBox,yBox,yBox1[yBox.indexOf(yboxs)]);
        }

    }

    
});


