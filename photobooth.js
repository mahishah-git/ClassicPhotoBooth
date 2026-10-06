// ========================================
// ELEMENTS
// ========================================

const camera = document.getElementById("camera");
const captureCanvas = document.getElementById("captureCanvas");
const ctx = captureCanvas.getContext("2d");

const captureBtn = document.getElementById("captureBtn");
const createStripBtn = document.getElementById("createStripBtn");
const downloadBtn = document.getElementById("downloadBtn");

const backBtn = document.getElementById("backBtn");
const continueBtn = document.getElementById("continueBtn");

const countdown = document.getElementById("countdown");
const flash = document.getElementById("flash");

const counter = document.getElementById("counter");

const previewBoxes = document.querySelectorAll(".preview");

const stripCanvas = document.getElementById("stripCanvas");
const stripCtx = stripCanvas.getContext("2d");

const stripContainer = document.getElementById("stripContainer");


// ========================================
// DATA
// ========================================

let photos = [];

const MAX_PHOTOS = 9;


// ========================================
// START CAMERA
// ========================================

async function startCamera(){

    try{

        const stream = await navigator.mediaDevices.getUserMedia({

            video:{
                facingMode:"user"
            },

            audio:false

        });

        camera.srcObject = stream;

    }

    catch(err){

        alert("Please allow camera access.");

    }

}

startCamera();


// ========================================
// CAPTURE BUTTON
// ========================================

captureBtn.addEventListener("click",startCountdown);


// ========================================
// COUNTDOWN
// ========================================

function startCountdown(){

    if(photos.length>=MAX_PHOTOS){

        return;

    }

    captureBtn.disabled=true;

    let number=3;

    countdown.textContent=number;

    const timer=setInterval(()=>{

        number--;

        if(number>0){

            countdown.textContent=number;

        }

        else{

            clearInterval(timer);

            countdown.textContent="";

            takePhoto();

        }

    },1000);

}



// ========================================
// TAKE PHOTO
// ========================================

function takePhoto(){

    captureCanvas.width=camera.videoWidth;
    captureCanvas.height=camera.videoHeight;

    // mirror the saved photo

    ctx.save();

    ctx.translate(captureCanvas.width,0);

    ctx.scale(-1,1);

    ctx.drawImage(

        camera,

        0,
        0,

        captureCanvas.width,
        captureCanvas.height

    );

    ctx.restore();


    // flash

    gsap.fromTo(

        flash,

        {opacity:1},

        {

            opacity:0,

            duration:0.5

        }

    );


    const image=captureCanvas.toDataURL("image/png");

    photos.push(image);


    const img=document.createElement("img");

    img.src=image;

    previewBoxes[photos.length-1].appendChild(img);


    counter.textContent=`${photos.length} / ${MAX_PHOTOS} Photos`;


    captureBtn.disabled=false;


    if(photos.length>0){

        createStripBtn.disabled=false;

    }

}
// ========================================
// CREATE PHOTO STRIP
// ========================================

createStripBtn.addEventListener("click", createPhotoStrip);

function createPhotoStrip() {

    const width = 420;
    const photoHeight = 250;
    const spacing = 20;
    const header = 80;
    const footer = 90;

    stripCanvas.width = width;

    stripCanvas.height =
        header +
        (photoHeight + spacing) * photos.length +
        footer;

    // Background

    stripCtx.fillStyle = "#f7f3ec";
    stripCtx.fillRect(
        0,
        0,
        stripCanvas.width,
        stripCanvas.height
    );

    stripCtx.fillStyle = "#3b2f2f";
    stripCtx.font = "32px serif";
    stripCtx.textAlign = "center";

    stripCtx.fillText(
        "Vintage Photo Booth",
        width / 2,
        45
    );

    let loaded = 0;

    photos.forEach((src, index) => {

        const img = new Image();

        img.onload = () => {

            stripCtx.drawImage(

                img,

                35,

                header + index * (photoHeight + spacing),

                width - 70,

                photoHeight

            );

            loaded++;

            if (loaded === photos.length) {

                stripCtx.fillStyle = "#555";

                stripCtx.font = "22px serif";

                stripCtx.fillText(

                    "Alexa, Play Poloroid Love by ENHYPEN.❤",

                    width / 2,

                    stripCanvas.height - 45

                );

                stripContainer.style.display = "flex";

                gsap.fromTo(

                    stripCanvas,

                    {
                        opacity: 0,
                        y: 80
                    },

                    {
                        opacity: 1,
                        y: 0,
                        duration: 1.2,
                        ease: "power3.out"
                    }

                );

                downloadBtn.style.display = "inline-block";

            }

        };

        img.src = src;

    });

}



// ========================================
// DOWNLOAD
// ========================================

downloadBtn.addEventListener("click", () => {

    const link = document.createElement("a");

    link.download = "poloroid-photo-strip.png";

    link.href = stripCanvas.toDataURL("image/png");

    link.click();

});