'use strict';

const squareDimensions = '23';

document.addEventListener('DOMContentLoaded', (event) => {
  // Generate the dynamic game grid and determine number of rows and columns
  createGrid();

  const maxRow = getMaxRow(); // Number of rows
  const maxCol = getMaxColumn(); // Number of columns

  // Starting user position, velocity, and length
  let snakeSquares = ['1_1']; // Starting user square in the grid
  let velocity = [0, 0]; // Starting velocity
  //let length = [currentUserSquare];

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
          if (velocity[0] !== 1 || snakeSquares.length === 1) {
            velocity = [-1, 0];
          }
          break;
        case 38: // Up
          // Ensure snake is not turning in on itself and change velocity
          if (velocity[1] !== 1 || snakeSquares.length === 1) {
            velocity = [0, -1];
          }
          break;
        case 39: // Right
          // Ensure snake is not turning in on itself and change velocity
          if (velocity[0] !== -1 || snakeSquares.length === 1) {
            velocity = [1, 0];
          }
          break;
        case 40: // Down
          // Ensure snake is not turning in on itself and change velocity
          if (velocity[1] !== -1 || snakeSquares.length === 1) {
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

    // Change the current player squares or end the game
    if (newRow < 0 || newRow > maxRow) { // Out of bounds
      clearInterval(gameLoop); // End game
      gameLost(snakeSquares);
    } else if (newCol < 0 || newCol > maxCol) { // Out of bounds
      clearInterval(gameLoop); // End Game
      gameLost(snakeSquares);
    } else {

      // Push changes through array
      const oldSnakeSquares = snakeSquares.slice();
      updateSnakeSquares(snakeSquares);
      const lastOldSnakeSquare = oldSnakeSquares[oldSnakeSquares.length - 1];
      if (!snakeSquares.includes(lastOldSnakeSquare) || snakeSquares.length === 1) {
        document.getElementById(lastOldSnakeSquare).className = 'col';
      }

      let currentUserSquare = newRow + '_' + newCol; // Determine id of new position

      if (snakeSquares.includes(currentUserSquare) && snakeSquares.length > 1) {
        clearInterval(gameLoop);
        gameLost(snakeSquares);
      }

      snakeSquares[0] = currentUserSquare;

      // User has moved over food
      if (currentUserSquare === currentFoodPosition) {
        const alias = currentUserSquare;
        snakeSquares.push(...[alias, alias, alias, alias, alias]); // Add 5 more squares to the length
        currentFoodPosition = generateFoodSquare(maxRow, maxCol, snakeSquares);
        document.getElementById(currentFoodPosition).className = 'col food';

        // Update score
        document.getElementById('score').innerText = snakeSquares.length;
      }

      drawSnake(snakeSquares, oldSnakeSquares);

      //document.getElementById(currentUserSquare).className = 'col snake'; // Change the current square to be a player square
    }
  }, 65);

});

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

function createGrid() {
  // Generate the game grid
  let grid = document.getElementById('grid-container'); // Grab grid div

  // Determine the number of rows and columns that will fit on the grid
  const numCols = Math.floor(grid.offsetWidth / squareDimensions);
  grid.style.width = `${numCols * squareDimensions}px`;
  const numRows = Math.floor(grid.offsetHeight / squareDimensions);
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

function drawSnake(snakeSquares) {
  snakeSquares.forEach((snakeSquare) => {
    document.getElementById(snakeSquare).className = 'col snake';
  });
}

function updateSnakeSquares(snakeSquares) {
  for (let i = snakeSquares.length - 1; i > 0; i--) {
    snakeSquares[i] = snakeSquares [i - 1];
  }
}

function generateFoodSquare(maxRow, maxCol, snakeSquares) {
  let foodSquare;
  do {
    let row = Math.floor(Math.random() * (maxRow + 1));
    let col = Math.floor(Math.random() * (maxCol + 1));
    foodSquare = row + '_' + col;
  }
  while(snakeSquares.includes(foodSquare));
  return foodSquare;
}

function gameLost(snakeSquares) {
  document.getElementById(snakeSquares[0]).style.backgroundColor = '#979280';
  document.getElementById('game-over').style.visibility = 'visible';
}
