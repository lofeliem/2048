let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]

let score = 0

// 主程序
window.onload = () => {
  init()
  document.getElementById("restart-btn").onclick = init
  // 监听方向键
  document.addEventListener("keydown", handleKeyPress)
};
  
function init() {
  score = 0
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      board[r][c] = 0
    }
  }

  generateRandom()
  generateRandom()
  updateBoardView()
}

function generateRandom() {
  const emptyCells = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) {
        emptyCells.push({ r, c })
      }
    }
  }

  if (emptyCells.length === 0) return

  const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  board[r][c] = Math.random() < 0.9 ? 2 : 4
}

function updateBoardView() {
  const container = document.getElementById("grid-container")
  container.innerHTML = ""

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = board[r][c]
      const cell = document.createElement("div")
      cell.className = "cell"
      if (val !== 0) {
        cell.textContent = val
        cell.classList.add("cell-" + val)
      }
      container.appendChild(cell)
    }
  }

  document.getElementById("score").textContent = score
}

function handleKeyPress(e) {
  let moved = false

  switch (e.key) {
    case "ArrowLeft":
      moved = moveLeft()
      break
    case "ArrowRight":
      moved = moveRight()
      break
    case "ArrowUp":
      moved = moveUp()
      break
    case "ArrowDown":
      moved = moveDown()
      break
  }

  if (moved) {
    generateRandom()
    updateBoardView()
  }
}

function moveLeft() {
  let moved = false
  for (let r = 0; r < 4; r++) {
    let row = board[r].filter(val => val !== 0) // 去掉 0
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2
        score += row[i]
        row[i + 1] = 0
        moved = true
      }
    }
    row = row.filter(val => val !== 0) // 再去一次 0
    while (row.length < 4) row.push(0)
    if (!arraysEqual(board[r], row)) {
      board[r] = row
      moved = true
    }
  }
  return moved
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, idx) => val === b[idx])
}
function moveRight() {
  rotateRows() // 反转每一行
  const moved = moveLeft()
  rotateRows() // 再次反转回来
  return moved
}

function rotateRows() {
  for (let r = 0; r < 4; r++) {
    board[r].reverse()
  }
}
function moveUp() {
  transpose()
  const moved = moveLeft()
  transpose()
  return moved
}

function moveDown() {
  transpose()
  rotateRows()
  const moved = moveLeft()
  rotateRows()
  transpose()
  return moved
}

function transpose() {
  let newBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      newBoard[r][c] = board[c][r]
    }
  }
  board = newBoard
}
  
  