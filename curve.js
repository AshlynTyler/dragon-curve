var canvas = document.getElementById("dc-canvas")

var draw = canvas.getContext("2d");

var foldingPoint = {
    xPos: 500,
    yPos: 300
}

var nextFoldingPoint;

var unfoldInter;

var foldingNum = 1;

var lineLength = 7;

var points = [];

var inAni = false;

var counter = 0;

//prototype for points on the dragon curve
function Point(x,y) {
    this.xPos = x + 500;

    this.yPos = y + 300;

    this.yPosRel = 0;

    this.xPosRel = 0;

    this.length = 0;

    this.angle = 0;


};

//first points of the first iteration.
points.push(new Point(1 * lineLength, 1 * lineLength));

points.push(new Point(0,0));

console.log(points)

//function to render line

function render(){
    draw.clearRect(0,0,1000,1000)

    draw.beginPath();
    draw.lineWidth = "2";
    draw.strokeStyle = "#88bb00"; // Green path

    draw.moveTo(points[0].xPos,points[0].yPos);

    for( i = 1; i < points.length; i++){
        draw.lineTo(points[i].xPos,points[i].yPos)
    }
    draw.stroke(); // Draw it
}

render()

$("#unfold").click(function(){
    if(!inAni){
        var currentPoints = points.length - 2;

        for(i = currentPoints; i > -1; i--){
            var newPoint = new Point(points[i].xPos-500,points[i].yPos-300);


            //setting x and y positions relative to the folding pivot point.
            newPoint.xPosRel = newPoint.xPos - foldingPoint.xPos;
            newPoint.yPosRel = newPoint.yPos - foldingPoint.yPos;

            //angle of direction point is from foldingPont.
            newPoint.angle = Math.atan2(newPoint.xPosRel,newPoint.yPosRel);

            newPoint.length = Math.sqrt(newPoint.xPosRel*newPoint.xPosRel + newPoint.yPosRel*newPoint.yPosRel)

            if(i === 0){
                nextFoldingPoint = newPoint;
            }

            points.push(newPoint);

            
        }

        unfoldInter = setInterval(function(){
            unfoldAni()
        },20);

        inAni = true;
    }
})

//unfolding animation
function unfoldAni(){

    counter++

    for( let i = points.length/2 + .5; i < points.length; i++){

        var pt = points[i];

        pt.xPos = pt.length * Math.sin(pt.angle - degToRad(counter)) + foldingPoint.xPos
        pt.yPos = pt.length * Math.cos(pt.angle - degToRad(counter)) + foldingPoint.yPos

        render();
    }

    


    if(counter === 90){
        clearInterval(unfoldInter);
        
        counter = 0

        inAni = false;

        foldingPoint = nextFoldingPoint;
    }
}



//converts degrees to radians
function degToRad(degrees){
    return degrees * Math.PI / 180
}