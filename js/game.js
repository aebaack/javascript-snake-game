'use strict';

const squareDimensions = '23';

document.addEventListener('DOMContentLoaded', (event) => {
  createGrid();
  //gameLoop();
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
    let newCol = document.createElement('div');

    newCol.className = 'col';
    newCol.id = `${currentRow}_${i}`;

    newCol.style.width = `${squareDimensions}px`;
    newCol.style.height = '100%';

    row.appendChild(newCol);
  }
}

function gameLoop() {
  console.log('this ran');
  setTimeout(gameLoop, 1000);
}
