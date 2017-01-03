'use strict';

// Configuration
const squareDimensions = '23'; // Dimension in pixels of each square on the grid
const frameInterval = 65; // Interval in milliseconds between each frame
const lengthPerFood = 5; // Amount of length added with each piece of food eaten

document.addEventListener('DOMContentLoaded', snakeGame);

function snakeGame() {
  // Clear a previous grid if the game has been restarted
  clearGrid();

  // Generate the dynamic game grid and determine number of rows and columns
  createGrid();

  const maxRow = getMaxRow(); // Number of rows
  const maxCol = getMaxColumn(); // Number of columns

  // Starting user position and velocity
  let snakeSquares = ['1_1']; // Starting user square in the grid
  let velocity = [0, 0]; // Starting velocity

  let currentFrameVelocity = velocity.splice(); // Holds the frame's velocity, since velocity can be changed multiple times between frames

  // Starting food position
  let currentFoodPosition = generateFoodSquare(maxRow, maxCol, snakeSquares);
  document.getElementById(currentFoodPosition).className = 'col food';

  // Arrow key movement
  document.addEventListener('keydown', (event) => {
    const arrowKeyCodes = [37, 38, 39, 40]; // Arrow keys
    const keyPressed = event.keyCode; // Key player pressed

    if (arrowKeyCodes.includes(keyPressed)) { // Velocity only resets for arrows
      //velocity = [0, 0]; // Reset velocity so player can only go one direction
      switch(keyPressed) {
        case 37: // Left
          // Ensure snake is not turning in on itself and change velocity
          if (currentFrameVelocity[0] !== 1 || snakeSquares.length === 1) {
            velocity = [-1, 0];
          }
          break;
        case 38: // Up
          // Ensure snake is not turning in on itself and change velocity
          if (currentFrameVelocity[1] !== 1 || snakeSquares.length === 1) {
            velocity = [0, -1];
          }
          break;
        case 39: // Right
          // Ensure snake is not turning in on itself and change velocity
          if (currentFrameVelocity[0] !== -1 || snakeSquares.length === 1) {
            velocity = [1, 0];
          }
          break;
        case 40: // Down
          // Ensure snake is not turning in on itself and change velocity
          if (currentFrameVelocity[1] !== -1 || snakeSquares.length === 1) {
            velocity = [0, 1];
          }
          break;
      }
    }
  });

  // Logic for the game loop
  const gameLoop = setInterval(() => {
    // Determine new positioning
    let position = snakeSquares[0].split('_'); // Determine current position
    let newRow = parseInt(position[0]) + velocity[1]; // Change current row
    let newCol = parseInt(position[1]) + velocity[0]; // Change current column

    // Set the current frame's velocity to equal the velocity set through arrow keys
    currentFrameVelocity = velocity.slice();

    // Change the current player squares or end the game
    if (newRow < 0 || newRow > maxRow) { // Out of bounds
      clearInterval(gameLoop); // End game
      gameLost(snakeSquares);
    } else if (newCol < 0 || newCol > maxCol) { // Out of bounds
      clearInterval(gameLoop); // End Game
      gameLost(snakeSquares);
    } else {

      // Push changes through array
      const oldSnakeSquares = snakeSquares.slice(); // Snake squares on previous frame
      updateSnakeSquares(snakeSquares); // Update snake position to new frame
      const lastOldSnakeSquare = oldSnakeSquares[oldSnakeSquares.length - 1]; // Grab the last snake square in the array oldSnakeSquares

      // If the snake's current position (snakeSquares) does not include the snake's previous last position (lastOldSnakeSquare), then that last square can be colored like a normal col
      // This ensures that when the snake eats food and gains five squares at its current position, those squares do not end up being colored like a normal col square even though the snake is still in the square
      if (!snakeSquares.includes(lastOldSnakeSquare) || snakeSquares.length === 1) {
        document.getElementById(lastOldSnakeSquare).className = 'col';
      }

      let currentUserSquare = newRow + '_' + newCol; // Determine id of new position

      // Snake has run in to itself
      if (snakeSquares.includes(currentUserSquare) && snakeSquares.length > 1) {
        clearInterval(gameLoop); // End game
        gameLost(snakeSquares);
      }

      snakeSquares[0] = currentUserSquare; // Update the snake square to include the newest square

      // User has moved over food
      if (currentUserSquare === currentFoodPosition) {
        // Add length to the snake
        addLengthToSnake(snakeSquares, currentUserSquare, lengthPerFood);

        // Create a new food square
        currentFoodPosition = generateFoodSquare(maxRow, maxCol, snakeSquares);
        document.getElementById(currentFoodPosition).className = 'col food';

        // Update score
        document.getElementById('score').innerText = snakeSquares.length;
      }

      drawSnake(snakeSquares, oldSnakeSquares); // Draw the snake
    }
  }, frameInterval);
}

// ----- CREATING THE GRID -----

function createGrid() {
  // Generate the game grid and grab dimensions
  let grid = document.getElementById('grid-container'); // Grab grid div
  const gridWidth = document.documentElement.clientWidth - 40;
  const gridHeight = document.documentElement.clientHeight - 60;
  // I know, hardcoding pixels is bad...

  // Determine the number of columns that will fit on the grid
  const numCols = Math.floor(gridWidth / squareDimensions);
  grid.style.width = `${numCols * squareDimensions}px`;

  // Determine the number of rows that will fit on the grid
  const numRows = Math.floor(gridHeight / squareDimensions);
  grid.style.height = `${numRows * squareDimensions}px`;

  // Add rows (which include columns) to the grid
  for (let i = 0; i < numRows; i++) {
    let row = createRow(numCols, i);
    grid.appendChild(row);
  }
}

function createRow(numCols, currentRow) {
  // Create a row div and append columns to it
  let newRow = document.createElement('div');

  newRow.className = 'row';
  newRow.style.height = `${squareDimensions}px`;

  createColumns(newRow, numCols, currentRow);

  return newRow;
}

function createColumns(row, numCols, currentRow) {
  // Create columns and append to the given row
  for (let i = 0; i < numCols; i++) {
    let newCol = document.createElement('div');

    newCol.className = 'col';
    newCol.id = `${currentRow}_${i}`;

    newCol.style.width = `${squareDimensions}px`;
    newCol.style.height = '100%';

    row.appendChild(newCol);
  }
}

// ----- DETERMINING SIZE OF GRID -----

function getMaxRow() {
  // Determine the max row id possible
  const rows = document.getElementsByClassName('row');
  return rows.length - 1;
}

function getMaxColumn() {
  // Determine the max column id possible
  const row = document.getElementsByClassName('row')[0];
  const lastCol = row.children[row.children.length - 1];

  return parseInt(lastCol.id.split('_')[1]);
}

// ----- OTHER GRID FUNCTIONS -----

function clearGrid() {
  // Delete a previous grid if the game has already been played
  let grid = document.getElementById('grid-container');
  while (grid.hasChildNodes()) {
    grid.removeChild(grid.lastChild);
  }

  // Hide the game over text if the game has been restarted
  document.getElementById('game-over').style.visibility = 'hidden';
}

// ----- DRAWING AND MODIFYING THE SNAKE -----

function drawSnake(snakeSquares) {
  // Traverse an array of square ids and add the class snake to them
  snakeSquares.forEach((snakeSquare) => {
    document.getElementById(snakeSquare).className = 'col snake';
  });
}

function updateSnakeSquares(snakeSquares) {
  // Move every value in snakeSquares to the next position in the array
  for (let i = snakeSquares.length - 1; i > 0; i--) {
    snakeSquares[i] = snakeSquares[i - 1];
  }
}

function addLengthToSnake(snakeSquares, currentUserSquare, amountToAdd) {
  // Add more snake squares to the snakeSquares array
  // amountToAdd squares will be added at currentUserSquare
  let newSnakeSquares = [];
  while (amountToAdd > 0) {
    newSnakeSquares.push(currentUserSquare);
    amountToAdd--;
  }

  snakeSquares.push(...newSnakeSquares);
}

// ----- CREATING FOOD SQUARES -----

function generateFoodSquare(maxRow, maxCol, snakeSquares) {
  // Return the position of a new food square
  let foodSquare;
  do {
    let row = Math.floor(Math.random() * (maxRow + 1));
    let col = Math.floor(Math.random() * (maxCol + 1));
    foodSquare = row + '_' + col;
  }
  while(snakeSquares.includes(foodSquare));
  return foodSquare;
}

// ----- GAME FUNCTIONALITY -----

function gameLost(snakeSquares) {
  // Display game over text and color the head of the snake
  document.getElementById(snakeSquares[0]).style.backgroundColor = '#979280';
  document.getElementById('game-over').style.visibility = 'visible';
}
