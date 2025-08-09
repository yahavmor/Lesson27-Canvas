'use strict';
var gShape 
var canvas 
var ctx 
let isDrawing = false;
var gLine ={
      color:'black',
      size:'5',
      shape:'round',
}


function onInit(){
      canvas = document.querySelector('.my-canvas')
      ctx = canvas.getContext('2d')
      resizeCanvas()
      renderCanvas()
}
function resizeCanvas() { 
const elContainer = document.querySelector('.canvas-container') 
canvas.width = elContainer.clientWidth 
canvas.height = elContainer.clientHeight 
} 
function renderCanvas() {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}
   

function onClearCanvas(){
      ctx.clearRect(0, 0, canvas.width, canvas.height)
}
function onChangeColor(color){
     gLine.color = color
}
function onChangeSize(size){
      gLine.size = size
}
function onChangeShape(shape){
      gLine.shape = shape
}

function onDown(ev) {
    const pos = getEvPos(ev);
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function onMove(ev) {
    if (!isDrawing) return;
    const pos = getEvPos(ev);
    checkBoundries(pos)

    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = gLine.color;
    ctx.lineWidth = gLine.size;
    ctx.lineCap = gLine.shape;
    ctx.stroke();
}

function onUp() {
    isDrawing = false;
    ctx.closePath();
}
function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container');
    const rect = elContainer.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
}
function getEvPos(ev) {
    const rect = canvas.getBoundingClientRect();

    let pos = {
        x: (ev.clientX - rect.left) * (canvas.width / rect.width),
        y: (ev.clientY - rect.top) * (canvas.height / rect.height),
    };

    return pos;
}



function onDownloadImg(elLink) {
    const imgContent = canvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}


function onImgInput(event){
      loadImageFromInput(event,renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    document.querySelector('.my-canvas').innerHTML = ''
    const reader = new FileReader()

    reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result

        img.onload = () => {
            onImageReady(img)
        }
    }

    reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img){
      ctx.drawImage(img,0,0,canvas.width,canvas.height)
}
function onUploadImg(ev){
      ev.preventDefault()
      const canvasData = canvas.toDataURL('image/jpeg')
      function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
            <a href="${uploadedImgUrl}">Image Url</a>
            <p>Image url: ${uploadedImgUrl}</p>
           
            <button class="btn-facebook" target="_blank" onclick="onUploadToFB('${encodedUploadedImgUrl}')">
                Share on Facebook  
            </button>
        `
    }

    uploadImg(canvasData, onSuccess)
}

async function uploadImg(imgData, onSuccess) {
    const CLOUD_NAME = 'webify'
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    const formData = new FormData()
    formData.append('file', imgData)
    formData.append('upload_preset', 'webify')
    try {
        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData
        })
        const data = await res.json()
        onSuccess(data.secure_url)

    } catch (err) {
        console.log(err)
    }
}


function onUploadToFB(url) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
}


function checkBoundries(pos){
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    if(pos.x>=canvasWidth||pos.y>=canvasHeight||pos.x<=0||pos.y<=0)isDrawing = false

}