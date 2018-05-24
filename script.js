var method
var t0
var theta10
var theta20
var w10
var w20
var mass1
var mass2
var length1
var length2
var gravity
var h
var n
var data
var dataIndex
var setIntervalID

function handleInputChanges() {
  method = document.getElementById("method").value
  t0 = parseFloat(document.getElementById("t0").value)
  theta10 = parseFloat(document.getElementById("theta10").value)
  theta20 = parseFloat(document.getElementById("theta20").value)
  w10 = parseFloat(document.getElementById("w10").value)
  w20 = parseFloat(document.getElementById("w20").value)
  mass1 = parseFloat(document.getElementById("mass1").value)
  mass2 = parseFloat(document.getElementById("mass2").value)
  length1 = parseFloat(document.getElementById("length1").value)
  length2 = parseFloat(document.getElementById("length2").value)
  gravity = parseFloat(document.getElementById("gravity").value)
  h = parseFloat(document.getElementById("h").value)
  n = parseFloat(document.getElementById("n").value)

  // console.log("Updating simulation with values:")
  // console.log("method", method)
  // console.log("t0", t0)
  // console.log("theta10", theta10)
  // console.log("theta20", theta20)
  // console.log("w10", w10)
  // console.log("w20", w20)
  // console.log("mass1", mass1)
  // console.log("mass2", mass2)
  // console.log("length1", length1)
  // console.log("length2", length2)
  // console.log("gravity", gravity)
  // console.log("h", h)
  // console.log("n", n)

  switch(method){
    case 'Euler': {
      data = S_Euler(t0, theta10, theta20, mass1, mass2, w10, w20, length1, length2, gravity, h, n)
      // console.log('Euler data', data)
      break
    };

    case 'S_PuntoM': {
      data = S_PuntoM(t0, theta10, theta20, mass1, mass2, w10, w20, length1, length2, gravity, h, n)
      // console.log('S_PuntoM data', data)
      break
    };

    case 'S_Ralston': {
      data = S_Ralston(t0, theta10, theta20, mass1, mass2, w10, w20, length1, length2, gravity, h, n)
      // console.log('S_Ralston data', data)
      break
    };

    case 'S_Heun': {
      data = S_Heun(t0, theta10, theta20, mass1, mass2, w10, w20, length1, length2, gravity, h, n)
      // console.log('S_Heun data', data)
      break
    };

    case 'S_RK4': {
      data = S_RK4(t0, theta10, theta20, mass1, mass2, w10, w20, length1, length2, gravity, h, n)
      // console.log('S_RK4 data', data)
      break
    };
  }

  dataIndex = 0
  clearInterval(setIntervalID)
  setIntervalID = setInterval(draw, h);
}

function dteta1(w1) {
  return w1
}

function dteta2(w2) {
  return w2
}

function dw1(t1, t2, m1, m2, w1, w2, l1, l2, g) {
  const Ra = -g*(2*m1+m2)*Math.sin(t1)-m2*g*Math.sin(t1-2*t2)
  const Rb = -2*Math.sin(t1-t2)*m2
  const Rc = Math.pow(w2, 2)*l2+Math.pow(w1, 2)*l1*Math.cos(t1-t2)
  const R2 = l1*(2*m1+m2-m2*Math.cos(2*t1-2*t2))
  return (Ra+(Rb*Rc))/R2
}

function dw2(t1, t2, m1, m2, w1, w2, l1, l2, g) {
  const Ra = 2*Math.sin(t1-t2)
  const Rb = Math.pow(w1, 2)*l1*(m1+m2)+g*(m1+m2)*Math.cos(t1)
  const Rc = Math.pow(w2, 2)*l2*Math.cos(t1-t2)
  const R2 = l2*(2*m1+m2-m2*Math.cos(2*t1-2*t2))
  return ((Rb+Rc)*Ra)/R2
}

function S_Euler(t0,t10,t20,m1,m2,w10,w20,l1,l2,g,h,n) {
  let t = [t0]
  let t1 = [t10]
  let t2 = [t20]
  let w1 = [w10]
  let w2 = [w20]
  for(let i=0; i<n; i++){
    t.push(t[i] + h)
    t1.push(t1[i] + dteta1(w1[i])*h)
    t2.push(t2[i] + dteta2(w2[i])*h)
    w1.push(w1[i] + dw1(t1[i], t2[i], m1, m2, w1[i], w2[i], l1, l2, g)*h)
    w2.push(w2[i] + dw2(t1[i], t2[i], m1, m2, w1[i], w2[i], l1, l2, g)*h)
  }

  return [t, t1, t2, w1, w2]
}

function S_Heun(t0,t10,t20,m1,m2,w10,w20,l1,l2,g,h,n) {
  let t =[t0]
  let t1 = [t10]
  let t2 = [t20]
  let w1 = [w10]
  let w2 = [w20]
  for(let i=0; i<n; i++){
    t.push(t[i]+h)
    const k1t1 = dteta1(w1[i])
    const k1w1 = dw1(t1[i],t2[i],m1,m2,w1[i],w2[i],l1,l2,g)
    const k1t2 = dteta2(w2[i])
    const k1w2 = dw2(t1[i],t2[i],m1,m2,w1[i],w2[i],l1,l2,g)
    
    const k2t1 = dteta1(w1[i]+k1t1*h)
    const k2w1 = dw1(t1[i]+k1t1*h,t2[i]+k1t2*h,m1,m2,w1[i]+k1w1*h,w2[i]+k1w2*h,l1,l2,g)
    
    const k2t2 = dteta2(w2[i]+k1t2*h)
    const k2w2 = dw2(t1[i]+k1t1*h,t2[i]+k1t2*h,m1,m2,w1[i]+k1w1*h,w2[i]+k1w2*h,l1,l2,g)
    
    t1.push(t1[i]+(k1t1+k2t1)*h/2)
    t2.push(t2[i]+(k1t2+k2t2)*h/2)
    w1.push(w1[i]+(k1w1+k2w1)*h/2)
    w2.push(w2[i]+(k1w2+k2w2)*h/2)
  }

  return [t,t1,t2,w1,w2]
}

function S_PuntoM(t0,t10,t20,m1,m2,w10,w20,l1,l2,g,h,n) {
  let t = [t0]
  let t1 = [t10]
  let t2 = [t20]
  let w1 = [w10]
  let w2 = [w20]
  for(let i=0; i<n; i++){
    t.push(t[i] + h)
    const k1t1 = dteta1(w1[i])
    const k1w1 = dw1(t1[i], t2[i], m1, m2, w1[i], w2[i], l1, l2, g)
    const k1t2 = dteta2(w2[i])
    const k1w2 = dw2(t1[i], t2[i], m1, m2, w1[i], w2[i], l1, l2, g)

    const k2t1 = dteta1(w1[i] + k1t1*h)
    const k2w1 = dw1(t1[i]+k1t1*h/2, t2[i]+k1t2*h/2, m1, m2, w1[i]+k1w1*h/2, w2[i]+k1w2*h/2, l1, l2, g)

    const k2t2 = dteta2(w2[i] + k1t2*h)
    const k2w2 = dw2(t1[i]+k1t1*h/2, t2[i]+k1t2*h/2, m1, m2, w1[i]+k1w1*h/2, w2[i]+k1w2*h/2, l1, l2, g)

    t1.push(t1[i] + k2t1*h)
    t2.push(t2[i] + k2t2*h)
    w1.push(w1[i] + k2w1*h)
    w2.push(w2[i] + k2w2*h)
  }

  return [t, t1, t2, w1, w2]
}

function S_Ralston(t0,t10,t20,m1,m2,w10,w20,l1,l2,g,h,n) {
  let t = [t0]
  let t1 = [t10]
  let t2 = [t20]
  let w1 = [w10]
  let w2 = [w20]
  for(let i=0; i<n; i++){
    t.push(t[i] + h)
    const k1t1 = dteta1(w1[i])
    const k1w1 = dw1(t1[i],t2[i],m1,m2,w1[i],w2[i],l1,l2,g)
    const k1t2 = dteta2(w2[i])
    const k1w2 = dw2(t1[i],t2[i],m1,m2,w1[i],w2[i],l1,l2,g)

    const k2t1 = dteta1(w1[i]+k1t1*h*3/4)
    const k2w1 = dw1(t1[i]+k1t1*h*3/4,t2[i]+k1t2*h*3/4,m1,m2,w1[i]+k1w1*h*3/4,w2[i]+k1w2*h*3/4,l1,l2,g)
        
    const k2t2 = dteta2(w2[i]+k1t2*h*3/4)
    const k2w2 = dw2(t1[i]+k1t1*h*3/4,t2[i]+k1t2*h*3/4,m1,m2,w1[i]+k1w1*h*3/4,w2[i]+k1w2*h*3/4,l1,l2,g)
  
    t1.push(t1[i]+(k1t1+2*k2t1)*h/3)
    t2.push(t2[i]+(k1t2+2*k2t2)*h/3)
    w1.push(w1[i]+(k1w1+2*k2w1)*h/3)  
    w2.push(w2[i]+(k1w2+2*k2w2)*h/3)  
  }

  return [t, t1, t2, w1, w2]
}

function S_RK4(t0,t10,t20,m1,m2,w10,w20,l1,l2,g,h,n) {
  let t =[t0]
  let t1 = [t10]
  let t2 = [t20]
  let w1 = [w10]
  let w2 = [w20]
  for(let i=0; i<n; i++){
    t.push(t[i]+h)
    const k1t1 = dteta1(w1[i])
    const k1w1 = dw1(t1[i],t2[i],m1,m2,w1[i],w2[i],l1,l2,g)
    const k1t2 = dteta2(w2[i])
    const k1w2 = dw2(t1[i],t2[i],m1,m2,w1[i],w2[i],l1,l2,g)
    
    const k2t1 = dteta1(w1[i]+k1t1*h/2)
    const k2w1 = dw1(t1[i]+k1t1*h/2,t2[i]+k1t2*h/2,m1,m2,w1[i]+k1w1*h/2,w2[i]+k1w2*h/2,l1,l2,g)
    const k2t2 = dteta2(w2[i]+k1t2*h/2)
    const k2w2 = dw2(t1[i]+k1t1*h/2,t2[i]+k1t2*h/2,m1,m2,w1[i]+k1w1*h/2,w2[i]+k1w2*h/2,l1,l2,g)
    
    const k3t1 = dteta1(w1[i]+k2t1*h/2)
    const k3w1 = dw1(t1[i]+k2t1*h/2,t2[i]+k2t2*h/2,m1,m2,w1[i]+k2w1*h/2,w2[i]+k2w2*h/2,l1,l2,g)
    const k3t2 = dteta2(w2[i]+k2t2*h/2)
    const k3w2 = dw2(t1[i]+k2t1*h/2,t2[i]+k2t2*h/2,m1,m2,w1[i]+k2w1*h/2,w2[i]+k2w2*h/2,l1,l2,g)
    
    const k4t1 = dteta1(w1[i]+k3t1*h)
    const k4w1 = dw1(t1[i]+k3t1*h,t2[i]+k3t2*h,m1,m2,w1[i]+k3w1*h,w2[i]+k3w2*h,l1,l2,g)
    const k4t2 = dteta2(w2[i]+k3t2*h)
    const k4w2 = dw2(t1[i]+k3t1*h,t2[i]+k3t2*h,m1,m2,w1[i]+k3w1*h,w2[i]+k3w2*h,l1,l2,g)
    
    t1.push(t1[i]+(k1t1+2*k2t1+2*k3t1+k4t1)*h/6)
    t2.push(t2[i]+(k1t2+2*k2t2+2*k3t2+k4t2)*h/6)
    w1.push(w1[i]+(k1w1+2*k2w1+2*k3w1+k4w1)*h/6)  
    w2.push(w2[i]+(k1w2+2*k2w2+2*k3w2+k4w2)*h/6)
  }         
           
  return [t,t1,t2,w1,w2]
}

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
  // Clear the canvas with large circle
  ctx.beginPath();
  ctx.arc(0, 0, 500, 0, 2*Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill()

  // First string
  drawString(ctx,data[1][dataIndex], length1, 2)

  // Move to first string ending
  firstXEnding = length1*Math.sin(data[1][dataIndex])
  firstYEnding = length1*Math.cos(data[1][dataIndex])
  ctx.translate(firstXEnding, firstYEnding)

  // Draw first mass
  ctx.beginPath();
  ctx.arc(0, 0, mass1, 0, 2*Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill()

  // Draw second string
  drawString(ctx,data[2][dataIndex], length2, 2)
  ctx.translate(-firstXEnding, -firstYEnding)

  // Move to second string ending
  secondXEnding = firstXEnding + length2*Math.sin(data[2][dataIndex])
  secondYEnding = firstYEnding + length2*Math.cos(data[2][dataIndex])
  ctx.translate(secondXEnding, secondYEnding)

  // Draw second mass
  ctx.beginPath();
  ctx.arc(0, 0, mass2, 0, 2*Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill()

  ctx.translate(-secondXEnding, -secondYEnding)

  dataIndex = dataIndex + 1;
}

// Initial call
handleInputChanges()