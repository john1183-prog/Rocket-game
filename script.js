const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext('2d');
var score = 0;
var bulletnum = 100;
// rocket
const rocket = {
  x: canvas.width / 3,
  y: canvas.height / 3,
  width: 40,
  height: 80,
  image: new Image()
};
// bullet and math variables
var x;
var y;
var draw = false;
var fn = '';
var sn = '';
var ans;
var result;
var toShowEffect = false;
var toShowRocketEffect = false;
var response = '';
var display = '';
var ar = {};
var level = 50;
var immunity = false;
var touchesx = [];
var immunityno = 0;
var orderOfQuestion = [division, multiplication, subtraction, addition]
// space junk/rock
const rock = {
  x: Math.floor(Math.random() * canvas.width),
  y: -20,
  width: 30 + Math.floor(Math.random() * 20),
  height: 30 + Math.floor(Math.random() * 20),
  image: new Image(),
  dx: 0.1,
  dy: 0.5
}
const rock2 = {
  x: Math.floor(Math.random() * canvas.width),
  y: -20,
  width: 30 + Math.floor(Math.random() * 20),
  height: 30 + Math.floor(Math.random() * 20),
  image: new Image(),
  dx: 0.1,
  dy: 0.7
}
const rock3 = {
  x: Math.floor(Math.random() * canvas.width),
  y: -20,
  width: 30 + Math.floor(Math.random() * 20),
  height: 30 + Math.floor(Math.random() * 20),
  image: new Image(),
  dx: 0.1,
  dy: 1
}
const rock4 = {
  x: Math.floor(Math.random() * canvas.width),
  y: -20,
  width: 30 + Math.floor(Math.random() * 20),
  height: 30 + Math.floor(Math.random() * 20),
  image: new Image(),
  dx: 0.1,
  dy: 0.8
}
const effect = {
  image: new Image()
}
const rocketEffect = {
  image: new Image()
}
var scoreimg = new Image();
var shield = new Image();
shield.src = 'shield.png'
scoreimg.src = 'scoreimg.png'
rock.image.src = 'rock.png'
rock2.image.src = 'rock.png'
rock3.image.src = 'rock.png'
rock4.image.src = 'rock.png'
rocket.image.src = 'rocket.png'
effect.image.src = 'effect.png'
rocketEffect.image.src = 'rocketeffect.png'

var rockArray = [rock, rock2, rock3, rock4];
// main game
window.addEventListener('load', function(){
  document.getElementById('loadingpage').style.display = "none";
})
rocket.image.onload = () => {
  rocket.y = rocket.y + rocket.height/3
  ctx.drawImage(rocket.image, rocket.x, rocket.y + 20, rocket.width, rocket.height);
  addition()
  console.log("rocket loaded successfully");
}
effect.onload = () => {
  console.log("effect loaded successfully");
}

const touchpad = document.getElementById("touchpad");
const levelbar = document.querySelector(".bar .meter");
const calcDisplay = document.querySelector(".keyboard p");

touchpad.addEventListener("touchmove", function(event){
  event.preventDefault()
  
  const touch = event.touches[0]
  const touchy = touch.clientY;
  touchesx.push(touch.clientX);
  if (touchesx.length > 2){
    touchesx = touchesx.slice(-2)
    let motion = touchesx[touchesx.length - 1] - touchesx[touchesx.length - 2]
    if (rocket.x > 0 && rocket.x < canvas.width - rocket.width){
      rocket.x += motion
    }else if (rocket.x < 0 && motion > 0){
      rocket.x += motion
    }else if (rocket.x > canvas.width - rocket.width && motion < 0){
      rocket.x += motion
    }
  }
})
touchpad.addEventListener("touchend", function(event){
  touchesx = []
})
touchpad.addEventListener("click", function(){
  if (bulletnum > 0){
    y = rocket.y + 10;
  x = rocket.x + rocket.width/2;
  draw = true
  }else{
    draw = false
  }
})

function update(){
  let id = requestAnimationFrame(update);
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(rocket.image, rocket.x, rocket.y, rocket.width, rocket.height);
  
  
  rockArray.forEach(r=>{
    ctx.drawImage(r.image, r.x, r.y, r.width, r.height);
  })
  
  spacejunks();
  if (bulletnum > 0 && draw){
    bulletMove();
  }
  if (rocket.y > canvas.height - 70){
        rocket.y--
      }
  
  ctx.font = '20px monospace';
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.textAlign = 'left';
  ctx.textBaseLine = 'top';
  ctx.fillText(`Score: ${score}`, 10, canvas.height - 5);
  ctx.fillText(`: ${bulletnum}`, canvas.width - 60, canvas.height - 3);
  ctx.fillStyle = 'rgba(0, 0, 128, 0.6)';
  ctx.fillRect((canvas.width - 150)/2, 0, 150, 20);
  ctx.fillStyle = 'rgb(250, 250, 255)';
  ctx.fillText(display, (canvas.width - 150)/2 + 10, 17);
  ctx.fillStyle = 'rgb(200, 200, 255)';
  ctx.textAlign = 'right';
  ctx.fillText(response, (canvas.width - 150)/2 + 130, 17);
  calcDisplay.innerHTML = response;
  
  if (ans == parseInt(response)){
    document.getElementById("gamebonus").pause();
    document.getElementById("gamebonus").currentTime = 0;
    document.getElementById("gamebonus").play();
      ctx.drawImage(scoreimg, canvas.width - 75, canvas.height - 27, 30, 25);
    bulletnum ++;
    level += 5;
    response = '';
    orderOfQuestion[orderOfQuestion.length - 1]();
        immunityno += 5;
  }else{
    ctx.drawImage(scoreimg, canvas.width - 80, canvas.height - 22, 25, 20);
  }
  // effects
  if (immunityno > 0){
    immunity = true;
  }else{
    immunity = false;
  }
  
  if (level > 100){
    orderOfQuestion.pop()
    if (orderOfQuestion.length == 0){
      document.querySelector("#endMsg").style.color = "lightgreen"
      document.getElementById("gamebonus").play()
      gameoverfunc("Congratulations!!")
    cancelAnimationFrame(id);
    }else{
    level = 50
    cancelAnimationFrame(id);
    transition()
    }
  }else if (level < 0){
    level = 0
    document.getElementById("gamemusic").pause()
    document.getElementById("gameover").play()
    document.getElementById("gamemusic").loop = false;
    cancelAnimationFrame(id);
    document.querySelector("#endMsg header").style.color = "red"
    gameoverfunc(`Game Over`);
  }
    levelbar.style.width = `${100 - level}%`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  if (toShowEffect){
    ctx.fillText('+20', ar.x + 50, ar.y)
    ctx.drawImage(effect.image, ar.x, ar.y, ar.width, ar.height);
  }
  if (toShowRocketEffect){
    rocket.y = ar.y
    ctx.fillText('-20', ar.x + 70, ar.y)
    ctx.drawImage(rocketEffect.image, ar.x, ar.y, ar.width, ar.height);
  }
  if (immunity){
    ctx.drawImage(shield, rocket.x - 10, rocket.y - 15, rocket.width + 20, rocket.height);
  }
  if (rocket.x < 0){
    rocket.x = 5
    }else if (rocket.x + rocket.width > canvas. width){
      rocket.x = canvas.width - rocket.width
    }
};

function bulletMove(){
    if (bulletnum > 0 && draw){
      if (y > -20){
        y -= 1
      }else{
        bulletnum--
        draw = false;
        return;
      }
  ctx.beginPath();
ctx.arc(x, y, 5, 0, 2 * Math.PI);
ctx.fillStyle = 'red';
ctx.fill();
ctx.lineWidth = 0;
ctx.stroke();
rockArray.forEach(r=>{
  if (x > r.x && x < r.x + r.width && y > r.y && y < r.y + r.width && y > 0){
    document.getElementById("rockexplosion").pause();
    document.getElementById("rockexplosion").currentTime = 0;
    document.getElementById("rockexplosion").play();
     level += 10;
    score += 20
    toShowEffect = true;
    setTimeout(()=>{toShowEffect = false}, 500)
    ar.x = r.x //affected rock
    ar.y = r.y //affected rock
    ar.width = r.width //affected rock
    ar.height = r.height //affected rock
    r.y = canvas.height + 100
    y = -20
    }
});
    }
};

function spacejunks(){
  rockArray.forEach((r)=>{
    if (r.y > canvas.height){
      r.x = rocket.width + Math.floor(Math.random() * (canvas.width - (2.5 * rocket.width) - r.width));
      r.y = -20
      r.width = 30 + Math.floor(Math.random() * 20)
      r.height = 30 + Math.floor(Math.random() * 20)
    }
    r.y += r.dy
    r.x += r.dx
    if (r.x < rocket.x + rocket.width - 10 && r.x + r.width > rocket.x + 10 && r.y > rocket.y && r.y < rocket.y + rocket.height - rocket.height/4 && r.y + r.height > rocket.y && !immunity){
      rocket.x = NaN;
      document.getElementById("rocketexplosion").pause()
      document.getElementById("rocketexplosion").currentTime = 0
      document.getElementById("rocketexplosion").play()
      toShowRocketEffect = true;
    ar.x = r.x //affected rock
    ar.y = r.y //affected rock
    ar.width = rocket.width //affected rock
    ar.height = rocket.height //affected rock
      level -= 10;
      immunityno += 5;
      setTimeout(()=>{
        rocket.x = canvas.width/2
        rocket.y = canvas.height
        toShowRocketEffect = false
      }, 1000)
    }
  })
};

function addition(){
  fn = Math.floor(Math.random() * 10);
  sn = Math.floor(Math.random() * 10);
  ans = fn + sn;
  display = `${fn} + ${sn} =`
}
function subtraction(){
  fn = Math.floor(Math.random() * 10);
  sn = Math.floor(Math.random() * 10);
  if (fn > sn){
  ans = fn - sn;
  display = `${fn} - ${sn} =`
  }else{
  ans = sn - fn;
  display = `${sn} - ${fn} =`
  }
}
function division(){
  fn = Math.floor(Math.random() * 9) + 1;
  sn = Math.floor(Math.random() * 9) + 1;
  ans = fn;
  display = `${fn*sn} / ${sn} =`
}
function multiplication(){
  fn = Math.floor(Math.random() * 10);
  sn = Math.floor(Math.random() * 10);
  ans = fn * sn;
  display = `${fn} x ${sn} =`
}

function add(num){
  response += num
}

function effects(r){
  ctx.drawImage(effect.image, r.x, r.y, r.width, r.height);
}
// home
function launch(){
  document.getElementById("homeMsg").style.display = "none";
 let id = requestAnimationFrame(launch);
  
  document.getElementById("gamemusic").play();
  document.getElementById("gamemusic").loop = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  rocket.y--
  ctx.drawImage(rocket.image, rocket.x, rocket.y, rocket.width, rocket.height);
    document.getElementById("progress-bar").style.display = "flex";
    document.getElementById("control").style.display = "flex";
  if (rocket.y < 0){
    setInterval(()=>{
      if (immunityno > 0){
        immunityno -= 0.5
      }
    score++
    level--
  }, 1000)
    cancelAnimationFrame(id);
    update()
    rocket.y = canvas.height
  }
}

function transition(){
  let id = requestAnimationFrame(transition);
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  rocket.y--
  ctx.font = '30px monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.textAlign = 'center';
  ctx.textBaseLine = 'top';
  ctx.fillText(`Level Completed`, canvas.width / 2, canvas.height / 3);
  ctx.drawImage(rocket.image, rocket.x, rocket.y, rocket.width, rocket.height);
  if (rocket.y < 0){
      immunity += 3;
    cancelAnimationFrame(id);
    update()
    rocket.y = canvas.height
    rockArray.forEach(r=>{
      r.y = 0
    })
  }
}

function gameoverfunc(message){
  document.getElementById("control").style.display = "none";
  document.querySelector("#endMsg").style.display = "block"
  document.querySelector("#endMsg p").innerHTML = `You scored a total of ${score} points!`
  document.querySelector("#endMsg header").innerHTML = message
}