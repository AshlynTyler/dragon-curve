var canvas = document.getElementById("dc-canvas")

var draw = canvas.getContext("2d");

var foldingPoint = {
    xPos: 0,
    yPos: 0
}

var nextFoldingPoint;

var unfoldInter;

var foldingNum = 1;

var lineLength = 10;

var points = [];

var inAni = false;

var counter = 0;

var scale = 20;

var zoom = .9965;

var unfoldCount = 0

//prototype for points on the dragon curve
function Point(x,y) {
    this.xPos = x;

    this.yPos = y;

    this.yPosRel = 0;

    this.xPosRel = 0;

    this.length = 0;

    this.angle = 0;


};

//first points of the first iteration.
points.push(new Point(0 * lineLength, 1 * lineLength));

points.push(new Point(0,0));

console.log(points)

draw.lineWidth = "2";
draw.strokeStyle = "#88bb00"; // Green path
draw.lineJoin = "round"
draw.translate(500,350)
draw.scale(scale,scale);
draw.lineCap = "round"
//function to render line

function render(){


    draw.clearRect(-5000,-5000,10000,10000)

    
    
    draw.beginPath();
    

    draw.moveTo(points[0].xPos,points[0].yPos);

    for( i = 1; i < points.length; i++){
        draw.lineTo(points[i].xPos,points[i].yPos)
    }
    draw.stroke(); // Draw it
}

render()

$("#unfold").click(function(){
    if(!inAni){
        counter = 0;

        var currentPoints = points.length - 2;

        for(i = currentPoints; i > -1; i--){
            var newPoint = new Point(points[i].xPos,points[i].yPos);


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

        $(".btn-large").addClass("disabled btn-flat")
    }
})

$("#fold").click(function(){
    if(!inAni  && unfoldCount !== 0){
        counter = 90;

        foldInter = setInterval(function(){
            foldAni()
        },20);

        inAni = true;

        foldingPoint = points[points.length/2 -.5]

        $(".btn-large").addClass("disabled btn-flat")
    }
})

//unfolding animation
function unfoldAni(){

    counter++

    for( let i = points.length/2 + .5; i < points.length; i++){

        var pt = points[i];

        pt.xPos = pt.length * Math.sin(pt.angle - degToRad(counter)) + foldingPoint.xPos
        pt.yPos = pt.length * Math.cos(pt.angle - degToRad(counter)) + foldingPoint.yPos

    }

    if(unfoldCount === 0)
        draw.rotate(degToRad(-.5))

    draw.scale(zoom,zoom)

    render()


    if(counter === 90){
        clearInterval(unfoldInter);
        
        counter = 0

        inAni = false;

        foldingPoint = nextFoldingPoint;

        unfoldCount++

        $("#unfold-count").text(unfoldCount)

        $(".btn-large").removeClass("disabled btn-flat")

        if(unfoldCount > 13)
            $("#warning").css("display","block")
    }
}

//folding animation
function foldAni(){
    counter--

    for( let i = points.length/2 + .5; i < points.length; i++){

        var pt = points[i];

        pt.xPos = pt.length * Math.sin(pt.angle - degToRad(counter)) + foldingPoint.xPos
        pt.yPos = pt.length * Math.cos(pt.angle - degToRad(counter)) + foldingPoint.yPos

    }

    if(unfoldCount === 1)
        draw.rotate(degToRad(+.5))

    draw.scale(1/zoom,1/zoom)

    render()

    if(counter === 0){
        clearInterval(foldInter);

        inAni = false;

        points = points.slice(0,points.length/2 + .5)

        foldingPoint = points[points.length - 1];

        unfoldCount--

        $("#unfold-count").text(unfoldCount)

        $(".btn-large").removeClass("disabled btn-flat")

        if(unfoldCount < 14)
            $("#warning").css("display","none")
    }
}



//converts degrees to radians
function degToRad(degrees){
    return degrees * Math.PI / 180
}