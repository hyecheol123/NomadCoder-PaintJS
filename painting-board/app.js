// HTML Elements
const canvas = document.getElementById('canvas');
const controlBtn = document.getElementById('control-btn');
const controlWrapper = document.getElementById('control-wrapper');
const colorControls = document.getElementsByClassName('color-control');
const thicknessControl = document.getElementById('thickness');
const modeBtn = document.getElementById('mode');
const saveBtn = document.getElementById('save');

// Generate the drawing context of the canvas
const context = canvas.getContext('2d');
context.fillRect(0, 0, canvas.width, canvas.height); // Default white background

// Global variable
let strokeStyle = '#2c2c2c'; // Set the line color to black by default
let fillStyle = 'white'; // Set the fill color to white by default
let lineWidth = 2.5; // Set the line width as 2.5 by default
let lineCap = 'round'; // Set the line ending shape
let painting = false; // whether the user is on painting mode or not
let filling = false; // By default, the brush will paint on the canvas
let showControl = false; // By default, does not show control
let imageData; // Temporal space to store canvas drawing information

/**
 * Function to set custom --vh that matches with innerHeight of screen
 * Also setup the canvas size
 */
 function setScreenSize() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // Setup Canvas Size
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  // Setup Canvas
  context.strokeStyle = strokeStyle;
  context.fillStyle = fillStyle;
  context.lineWidth = lineWidth;
  context.lineCap = lineCap;
}

setScreenSize();
// Dynamically change screen size
window.addEventListener('resize', () => {
  setScreenSize();

  // reload saved image
  context.putImageData(imageData, 0, 0);
});

// Show/Hide Control
controlBtn.addEventListener('click', () => {
  if(showControl) {
    showControl = false;
    controlBtn.innerText = 'Show Control';
    controlWrapper.style.display = 'none';
  } else {
    showControl = true;
    controlBtn.innerText = 'Hide Control';
    controlWrapper.style.display = 'flex';
  }
});

// Change color
for (colorBtn of colorControls) {
  colorBtn.addEventListener('click', (clickEvent) => {
    // Show newly selected color
    const prevSelected = document.getElementsByClassName('selected')[0];
    prevSelected.classList.remove('selected');
    clickEvent.target.classList.add('selected');
    
    // Change Canvas Setup
    strokeStyle = clickEvent.target.style.backgroundColor;
    fillStyle = clickEvent.target.style.backgroundColor;
    context.strokeStyle = strokeStyle;
    context.fillStyle = fillStyle;
  });
}

// Change thickness
thicknessControl.addEventListener('input', () => {
  lineWidth = thicknessControl.value;
  context.lineWidth = lineWidth;
});

// Change Mode (Paint <-> Fill)
modeBtn.addEventListener('click', () => {
  if(filling) {
    filling = false;
    modeBtn.innerText = 'Fill';
  } else {
    filling = true;
    modeBtn.innerText = 'Paint';
  }
});

// Save the image
saveBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'paint.png';
  link.click();
});

// Canvas EventListeners for Mouse Events
// Click on canvas to fill the canvas
canvas.addEventListener('click', () => {
  if(filling) {
    // fill the canvas
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Save Image Data
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  }
});
// Draw when mouse moves
canvas.addEventListener('mousemove', (mouseEvent) => {
  const cordX = mouseEvent.offsetX;
  const cordY = mouseEvent.offsetY;
  
  // Paint a line (or point)
  if(!painting) {
    context.beginPath();
    context.moveTo(cordX, cordY);
  } else {
    context.lineTo(cordX, cordY);
    context.stroke();
  }
});
// Starts drawing when mouse prssed
canvas.addEventListener('mousedown', () => {
  painting = true;
});
// End drawing when mouse releases
canvas.addEventListener('mouseup', () => {
  painting = false;

  // Save Image Data
  imageData = context.getImageData(0, 0, canvas.width, canvas.height);
});
// End drawing when mouse moves outside the canvas
canvas.addEventListener('mouseleave', () => {
  painting = false;
  
  // Save Image Data
  imageData = context.getImageData(0, 0, canvas.width, canvas.height);
});

// TODO: touchscreen