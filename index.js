/**
 * PROBLEMs that you will encounter in this project
 *
 * 1. Problem 1:___
 *
 * When we start Building the Mouse move pointer for drawing , we come to know that
 * it is drawing but not with the cursor.
 * so we can fix it via setting the offsetWidth and offsetHeight i the
 * window.addEventListener of the canvas.
 *
 * 2. Problem 2:___
 *
 * As we hover on the canvas it start drawing immediately but we want to draw
 * when we will click on the mouse and move the pointer.
 * so we can fix it via mouse up and mouse down events along with variable (isDrawing)
 * basically a check whether you want to draw or not using mouse
 *
 * 3. Problem 3: ___
 *
 * it is working fine with the solution of above Problems but now
 * the problem is that it is joining the last point where you leave the pointer
 *
 * 4.Problem 4: ___
 *
 * When you will write the drawRectangle function . then it will create rectangle for every point
 * you can see it in the image attached
 * basically it will drag all the rectangles .
 *
 * it can be resolved by using getImageData and putImageData method
 */

// Global Variables with default Values
let isDrawing = false;
let brushWidth = 2;
let selectedTool = "Brush";
let selectedColor = "#000";

let prevMouseX, prevMouseY, snapShot;

/**
 * getContext method returns a drawing context on the canvas
 * We will Draw free hand , so we will use mouse gestures
 * and Use the event listener of mouse
 */

const canvas = document.querySelector("canvas");
cxt = canvas.getContext("2d", { willReadFrequently: true });

let toolBtns = document.querySelectorAll(".tool");
let fillColor = document.querySelector("#fill-color");
let sizeSlider = document.querySelector("#size-slider");
const colorPicker = document.getElementById("color-picker");
let colorBtns = document.querySelectorAll(".colors .option");
let clearCanvas = document.querySelector(".clear-canvas");
let saveImg = document.querySelector(".save-img");

/**
 * This Set Background function will set a white Background for your Img
 * if we don't call it . our Img will be background less
 */
const setCanvasBackground = () => {
  cxt.fillStyle = "#fff";
  cxt.fillRect(0, 0, canvas.width, canvas.height);
  cxt.fillStyle = selectedColor;
};

/**
 *  we need to set the width and height of the canvas to draw properly
 * offset width/height returns the viewable width /height af an element
 *
 */
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  setCanvasBackground();
});

const drawRectangle = (e) => {
  /**
   * strokeRect() method draw a rectangle without fill
   * it take x-coordinate y-coordinate width height as arguments
   *
   * To get the width and height of the rectangle .pass the mouse down
   * Pointer values
   */

  if (!fillColor.checked) {
    return cxt.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  cxt.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

const drawCircle = (e) => {
  cxt.beginPath();
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  /**
   * acr() method is used to Create a Circle
   * It takes x-coordinate y-coordinate radius start angle and end angle
   */
  cxt.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? cxt.fill() : cxt.stroke();
};

const drawTriangle = (e) => {
  cxt.beginPath(); // Creating new Path to draw Triangle
  cxt.moveTo(prevMouseX, prevMouseY);

  cxt.lineTo(e.offsetX, e.offsetY);
  /**
   * Creating the Bottom Line of the Triangle
   */
  cxt.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  /**
   * Closing path of Triangle so that third line draw automatically
   */
  cxt.closePath();
  fillColor.checked ? cxt.fill() : cxt.stroke();
};

/**
 * startDraw Function ____
 * It is just a check function that are you really want to draw or just hover the canvas
 * The check is done via mousedown eventlistener
 *
 */
const startDraw = (e) => {
  isDrawing = true;

  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  cxt.beginPath();
  /**
   * beginPath() method creates a new path to drawPoint
   */
  cxt.lineWidth = brushWidth; // Passes the brushWidth as lineWidth

  /**
   * strokeStyle and  fillStyle property will set the color the of pen accordingly
   */
  cxt.strokeStyle = selectedColor;
  cxt.fillStyle = selectedColor;

  /**
   * getImageData() method returns an ImageData Object that copies the pixel data
   *
   * Coping the canvas data and passing as snapShot Value.
   * This avoids dragging the image
   */
  snapShot = cxt.getImageData(0, 0, canvas.width, canvas.height);
};

/**
 * Drawing Function ___
 * lineTo() method creates a new Line
 * ctx.lineTo(x-coordinate , y-coordinate)
 *
 * offsetX and offsetY returns the x and y coordinate of the Mouse Pointer
 * stroke() method draws / fill color in the line
 *
 */

const drawing = (e) => {
  /**
   * If Drawing is false means we haven't click the mouse btn
   * and we don't want to draw now so return
   */

  if (!isDrawing) return;

  /**
   * PuImageData() method puts the image data back onto the canvas
   */

  cxt.putImageData(snapShot, 0, 0);

  /**
   * If we are using a shape or something else except brush then
   * obiously we don't want to draw line hence we have to check that
   * is the tool is brush . then only we will add offsetX and offsetY and create a Line
   * |__>
   */

  if (selectedTool == "Brush" || selectedTool == "Eraser") {
    /**
     * If selected Tool is Eraser than set the strokeStyle to white
     * This will Erase the existing content
     * else set stroke color to selected color
     */

    cxt.strokeStyle = selectedTool === "Eraser" ? "#fff" : selectedColor;

    cxt.lineTo(e.offsetX, e.offsetY);
    cxt.stroke();
  } else if (selectedTool == "Rectangle") {
    drawRectangle(e);
  } else if (selectedTool == "Circle") {
    drawCircle(e);
  } else if (selectedTool == "Triangle") {
    drawTriangle(e);
  }
  // console.log(e)
};

/**
 * For Each Loop on the Tool Btns
 */
toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    /**
     * In the above two Lines
     * 1. We are removing the active class from the previous
     *  selected tool
     * 2. adding the active class in the currently selected tool
     */
    selectedTool = btn.id;
    // console.log(btn.id)
  });
});

sizeSlider.addEventListener("change", () => {
  brushWidth = sizeSlider.value;
});

colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
    console.log(
      window.getComputedStyle(btn).getPropertyValue("background-color")
    );
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
  });
});

/**
 * In color Picker we take input from the color box
 * so we add and eventlistener of event type "input" to
 * take the color from user
 */

colorPicker.addEventListener("input", () => {
  console.log(colorPicker.value);
  selectedColor = colorPicker.value;
});

clearCanvas.addEventListener("click", () => {
  /**
   * clearRect() method clears the specified pixels within a given rectangle
   * That's how it will clear the whole canvas
   */
  cxt.clearRect(0, 0, canvas.width, canvas.height);

  setCanvasBackground();
});

saveImg.addEventListener("click", () => {
  // Creating an anchor Tag (Basically the DownLoad Link)
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  /**
   * toDataURL() method returns a dataURL of the image
   */
  link.href = canvas.toDataURL();
  link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});
