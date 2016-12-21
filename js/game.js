'use strict';

document.addEventListener('DOMContentLoaded', (event) => {
  const grid = document.getElementById('grid-container');
  const height = grid.offsetHeight;
  const width = grid.offsetWidth;
  let row = createRow('a');
  createColumns(row);
  grid.appendChild(row);
});

function createRow(height) {
  let newRow = document.createElement('div');
  newRow.style.height = '15px';
  newRow.style.width = '100%';
  return newRow;
}

function createColumns(row) {
  let newCol = document.createElement('div');
  newCol.style.height = 'inherit';
  newCol.style.width = '15px';
  row.appendChild(newCol);
}
