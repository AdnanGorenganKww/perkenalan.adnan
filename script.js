/* ==========================================
   SELECT ELEMENTS
========================================== */

const scene = document.getElementById("scene");

const mouseLight = document.getElementById("mouse-light");

const loader = document.getElementById("loader");

const logos = document.querySelectorAll(".orbit-logo");

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

/* ==========================================
   LOADING SCREEN
========================================== */

window.addEventListener("load", () => {

    setTimeout(() => {

        loader.style.opacity = "0";
        loader.style.pointerEvents = "none";
        loader.style.transition = "1s";

        setTimeout(() => {

            loader.remove();

        }, 1000);

    }, 1800);

});

/* ==========================================
   MOUSE POSITION
========================================== */

let targetX = 0;
let targetY = 0;

let currentX = 0;
let currentY = 0;

/* ==========================================
   MOUSE MOVE
========================================== */

function updatePointer(x, y){

    targetX = (x / window.innerWidth - 0.5);
    targetY = (y / window.innerHeight - 0.5);

    mouseLight.style.left = x + "px";
    mouseLight.style.top = y + "px";

}

window.addEventListener("mousemove", (e)=>{

    updatePointer(
        e.clientX,
        e.clientY
    );

});

/* ==========================================
   TOUCH SUPPORT
========================================== */

window.addEventListener("touchmove", (e)=>{

    const touch = e.touches[0];

    updatePointer(
        touch.clientX,
        touch.clientY
    );

},{ passive:true });

/* ==========================================
   CURSOR TRAIL
========================================== */

const trailCount = 10;

const trailElements = [];

for(let i=0;i<trailCount;i++){

    const dot = document.createElement("div");

    dot.style.position = "fixed";
    dot.style.width = "8px";
    dot.style.height = "8px";

    dot.style.borderRadius = "50%";

    dot.style.background =
    "rgba(0,212,255,.8)";

    dot.style.pointerEvents = "none";

    dot.style.zIndex = "999";

    dot.style.opacity =
    1 - (i / trailCount);

    document.body.appendChild(dot);

    trailElements.push({

        element:dot,
        x:0,
        y:0

    });

}

/* ==========================================
   PARTICLE SYSTEM
========================================== */

function resizeCanvas(){

    canvas.width =
    window.innerWidth;

    canvas.height =
    window.innerHeight;

}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);

const particles = [];

const particleCount = 35;

for(let i=0;i<particleCount;i++){

    particles.push({

        x:Math.random()*canvas.width,

        y:Math.random()*canvas.height,

        radius:
        Math.random()*2+1,

        vx:
        (Math.random()-0.5)*0.2,

        vy:
        (Math.random()-0.5)*0.2

    });

}

/* ==========================================
   ORBIT SETTINGS
========================================== */

const orbitData = [

{
radius:170,
speed:0.0007,
angle:0
},

{
radius:230,
speed:0.0005,
angle:1.2
},

{
radius:260,
speed:0.0008,
angle:2.3
},

{
radius:190,
speed:0.0006,
angle:3.5
},

{
radius:290,
speed:0.0004,
angle:5.2
}

];

/* ==========================================
   ANIMATION LOOP
========================================== */

function animate(time){

    requestAnimationFrame(
        animate
    );

    /* =========================
       LERP SMOOTH
    ========================= */

    currentX +=
    (targetX-currentX)*0.08;

    currentY +=
    (targetY-currentY)*0.08;

    /* =========================
       SCENE PARALLAX
    ========================= */

    const rotateY =
    currentX*45;

    const rotateX =
    -currentY*45;

    scene.style.transform =

    `
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    `;

    /* =========================
       ORBIT ENGINE
    ========================= */

    logos.forEach((logo,index)=>{

        const orbit =
        orbitData[index];

        const angle =
        time*orbit.speed
        + orbit.angle;

        const x =
        Math.cos(angle)
        * orbit.radius;

        const y =
        Math.sin(angle)
        * orbit.radius;

        const floatY =
        Math.sin(
            time*0.002
            + index
        )*12;

        const scale =
        1 +
        Math.sin(
            time*0.001
            + index
        )*0.05;

        logo.style.transform =

        `
        translate(
        ${x}px,
        ${y+floatY}px
        )
        scale(${scale})
        `;

    });

    /* =========================
       PARTICLES
    ========================= */

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particles.forEach(p=>{

        p.x += p.vx;
        p.y += p.vy;

        if(
            p.x<0 ||
            p.x>canvas.width
        ){

            p.vx *= -1;

        }

        if(
            p.y<0 ||
            p.y>canvas.height
        ){

            p.vy *= -1;

        }

        ctx.beginPath();

        ctx.arc(

            p.x,
            p.y,
            p.radius,

            0,
            Math.PI*2

        );

        ctx.fillStyle =
        "rgba(255,255,255,.3)";

        ctx.fill();

    });

    /* =========================
       CURSOR TRAIL
    ========================= */

    let x =
    (targetX+0.5)
    *window.innerWidth;

    let y =
    (targetY+0.5)
    *window.innerHeight;

    trailElements.forEach(
    (dot,index)=>{

        const next =
        trailElements[
            index-1
        ] || {

            x,
            y

        };

        dot.x +=
        (next.x-dot.x)*0.25;

        dot.y +=
        (next.y-dot.y)*0.25;

        dot.element.style.transform=

        `
        translate(
        ${dot.x}px,
        ${dot.y}px
        )
        `;

    });

}

/* ==========================================
   START LOOP
========================================== */

requestAnimationFrame(
    animate
);

/* ==========================================
   ENTRANCE ANIMATION
========================================== */

window.addEventListener(
"load",
()=>{

    const profile =
    document.querySelector(
    ".profile-wrapper"
    );

    const hero =
    document.querySelector(
    ".hero-content"
    );

    profile.animate([

    {

        opacity:0,
        transform:
        "scale(.6)"

    },

    {

        opacity:1,
        transform:
        "scale(1)"

    }

    ],{

        duration:1500,
        easing:"ease-out",

        fill:"forwards"

    });

    hero.animate([

    {

        opacity:0,
        transform:
        "translateY(50px)"

    },

    {

        opacity:1,
        transform:
        "translateY(0)"

    }

    ],{

        duration:1800,
        easing:"ease-out",

        fill:"forwards"

    });

});