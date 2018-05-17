angle = 1;
firstStringLength = 100;
firstMassSize = 20;

secondStringLength = 150;
secondMassSize = 10;

var canvas = document.getElementById("simulation-canvas");
var ctx = canvas.getContext("2d");
ctx.translate(300,300);

function drawString(ctx, pos, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0,0);
  ctx.rotate(-pos);
  ctx.lineTo(0, length);
  ctx.stroke();
  ctx.rotate(pos);
}


function draw() {
  angle = angle + 0.02;

  // Clear the canvas with large circle
  ctx.beginPath();
  ctx.arc(0, 0, 500, 0, 2*Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill()

  // First string
  drawString(ctx,angle, firstStringLength, 2)

  // Move to first string ending
  firstXEnding = firstStringLength*Math.sin(angle)
  firstYEnding = firstStringLength*Math.cos(angle)
  ctx.translate(firstXEnding, firstYEnding)

  // Draw first mass
  ctx.beginPath();
  ctx.arc(0, 0, firstMassSize, 0, 2*Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill()

  // Draw second string
  drawString(ctx,3*angle, secondStringLength, 2)
  ctx.translate(-firstXEnding, -firstYEnding)

  // Move to second string ending
  secondXEnding = firstXEnding + secondStringLength*Math.sin(3*angle)
  secondYEnding = firstYEnding + secondStringLength*Math.cos(3*angle)
  ctx.translate(secondXEnding, secondYEnding)

  // Draw second mass
  ctx.beginPath();
  ctx.arc(0, 0, secondMassSize, 0, 2*Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill()

  ctx.translate(-secondXEnding, -secondYEnding)
}

setInterval(draw, 10);