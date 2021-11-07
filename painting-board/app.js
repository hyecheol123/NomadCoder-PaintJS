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
let points = []; // points that used for drawing lines

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

/**
 * Function to get cordinates from the event
 * 
 * @param {Event} event MouseEvent or TouchEvent
 */
function getCords(event) {
  // Use touchEvent's touches[0] or mouseEvent
  const source = event.touches ? event.touches[0] : event;

  // return cordinates
  return {
    x: source.pageX,
    y: source.pageY
  };
}

/**
 * Event Handler function to start drawing
 * 
 * @param {Event} event MouseEvent or TouchEvent
 */
function startDrawing(event) {
  painting = true;
  points.push(getCords(event));
}

/**
 * Event Handler function to continue drawing
 * 
 * @param {Event} event MouseEvent or TouchEvent
 */
function stillDrawing(event) {
  // Code only runs when painting is true
  if(!painting) return;

  // Set cordinates
  points.push(getCords(event));
  let p1 = points[0];
  let p2 = points[1];

  // Draw curve
  context.beginPath();
  context.moveTo(p1.x, p1.y);
  for(let i = 1; i < points.length; i++) {
    context.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
    p1 = points[i];
    p2 = points[i + 1];
  }
  context.lineTo(p1.x, p1.y);
  context.stroke();
}

/**
 * Event Handler function to stop drawing
 */
function stopDrawing() {
  painting = false;
  points = [];
  
  // Save Image Data
  imageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

setScreenSize();
// Dynamically change screen size
window.addEventListener('resize', () => {
  setScreenSize();

  // reload saved image
  if(imageData) {
    context.putImageData(imageData, 0, 0);
  }
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

// Canvas EventListeners
// Click on canvas to fill the canvas
canvas.addEventListener('click', () => {
  if(filling) {
    // fill the canvas
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Save Image Data
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  }
});

// TouchEvents
// Start drawing when touch start
canvas.addEventListener('touchstart', startDrawing);
// Draw while touching
canvas.addEventListener('touchmove', stillDrawing);
// End drawing when touch end
canvas.addEventListener('touchend', stopDrawing);

// MouseEvents
// Start drawing when mouse prssed
canvas.addEventListener('mousedown', startDrawing);
// Draw when mouse moves
canvas.addEventListener('mousemove', stillDrawing);
// End drawing when mouse releases
canvas.addEventListener('mouseup', stopDrawing);
// End drawing when mouse moves outside the canvas
canvas.addEventListener('mouseleave', stopDrawing);
