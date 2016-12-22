'use strict';

const squareDimensions = '23';

document.addEventListener('DOMContentLoaded', (event) => {
  createGrid();

  let currentUserSquare = '1_1';
  let velocity = [1, 1];
  const gameLoop = setInterval(() => {
    let position = currentUserSquare.split('_');
    let newRow = parseInt(position[0]) + velocity[1];
    let newCol = parseInt(position[1]) + velocity[0];

    if (newRow < 0 || newRow > 15) {
      clearInterval(gameLoop);
    } else if (newCol < 0 || newCol > 15) {
      clearInterval(gameLoop);
    } else {
      document.getElementById(currentUserSquare).className = 'col';

      currentUserSquare = newRow + '_' + newCol;
      document.getElementById(currentUserSquare).className = 'col snake';
    }
  }, 300);

});

function createGrid() {
  let grid = document.getElementById('grid-container');

  const numCols = Math.floor(grid.offsetWidth / squareDimensions);
  grid.style.width = `${numCols * squareDimensions}px`;
  const numRows = Math.floor(grid.offsetHeight / squareDimensions);
  grid.style.height = `${numRows * squareDimensions}px`;

  for (let i = 0; i < numRows; i++) {
    let row = createRow(numCols, i);
    grid.appendChild(row);
  }
}

function createRow(numCols, currentRow) {
  let newRow = document.createElement('div');

  newRow.className = 'row';
  newRow.style.height = `${squareDimensions}px`;

  createColumns(newRow, numCols, currentRow);

  return newRow;
}

function createColumns(row, numCols, currentRow) {
  for (let i = 0; i < numCols; i++) {
    maxCol = i;

    let newCol = document.createElement('div');

    newCol.className = 'col';
    newCol.id = `${currentRow}_${i}`;

    newCol.style.width = `${squareDimensions}px`;
    newCol.style.height = '100%';

    row.appendChild(newCol);
  }
}
