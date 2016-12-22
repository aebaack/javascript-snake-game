'use strict';

const squareDimensions = '23';

document.addEventListener('DOMContentLoaded', (event) => {
  createGrid();
});

function createGrid() {
  let grid = document.getElementById('grid-container');

  const numCols = Math.floor(grid.offsetWidth / squareDimensions);
  grid.style.width = `${numCols * squareDimensions}px`;

  while (window.innerHeight - 60 > grid.offsetHeight + parseInt(squareDimensions)) {
    let row = createRow(numCols);
    grid.appendChild(row);
  }
}

function createRow(numCols) {
  let newRow = document.createElement('div');

  newRow.className = 'row';
  newRow.style.height = `${squareDimensions}px`;

  createColumns(newRow, numCols);

  return newRow;
}

function createColumns(row, numCols) {
  for (let i = 0; i < numCols; i++) {
    let newCol = document.createElement('div');
    newCol.className = 'col';
    newCol.style.width = `${squareDimensions}px`;
    newCol.style.height = '100%';

    row.appendChild(newCol);
  }
}
