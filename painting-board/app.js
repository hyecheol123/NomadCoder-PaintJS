// HTML Elements
const canvas = document.getElementById('canvas');
const colorControls = document.getElementsByClassName('color-control');
const thicknessControl = document.getElementById('thickness');
const modeBtn = document.getElementById('mode');
// Setup Canvas
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Generate the drawing context of the canvas
const context = canvas.getContext('2d');
context.strokeStyle = '#2c2c2c'; // Set the line color to black by default
context.fillStyle = 'white'; // Set the fill color to white by default
context.lineWidth = 2.5; // Set the line width as 2.5 by default
context.lineCap = 'round'; // Set the line ending shape

// Global variable
let painting = false; // whether the user is on painting mode or not
let filling = false; // By default, the brush will paint on the canvas

// Change color
for (colorBtn of colorControls) {
  colorBtn.addEventListener('click', (clickEvent) => {
    context.strokeStyle = clickEvent.target.style.backgroundColor;
  });
}

// Change thickness
thicknessControl.addEventListener('input', () => {
  context.lineWidth = thicknessControl.value;
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

// Canvas EventListeners for Mouse Events
// Click on canvas to fill the canvas
canvas.addEventListener('click', () => {
  if(filling) {
    // Set the color
    context.fillStyle = context.strokeStyle;
    // fill the canvas
    context.fillRect(0, 0, canvas.width, canvas.height);
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
});
// End drawing when mouse moves outside the canvas
canvas.addEventListener('mouseleave', () => {
  painting = false;
});

// touchscreen