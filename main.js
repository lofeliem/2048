let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]

let score = 0
let newCell = null
// 移动端触屏移动
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
  if (e.touches.length > 0) {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }
});

document.addEventListener("touchend", (e) => {
  if (e.changedTouches.length > 0) {
    const deltaX = e.changedTouches[0].clientX - touchStartX
    const deltaY = e.changedTouches[0].clientY - touchStartY

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 横向滑动
      if (deltaX > 30) handleKeyPress({ key: "ArrowRight" })
      else if (deltaX < -30) handleKeyPress({ key: "ArrowLeft" })
    } else {
      // 纵向滑动
      if (deltaY > 30) handleKeyPress({ key: "ArrowDown" })
      else if (deltaY < -30) handleKeyPress({ key: "ArrowUp" })
    }
  }
})


// 主程序
window.onload = () => {
  init()
  document.getElementById("retry-btn").onclick = () => {
    hideGameOver();
    init();
  };
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
// 开局生成两个数字
  generateRandom()
  generateRandom()
  updateBoardView()
}

function generateRandom() {
  const emptyCells = []
// 寻找空格子   
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) {
        emptyCells.push({ r, c })
      }
    }
  }
// 如果没有空帖子了，不生成新的数字
  if (emptyCells.length === 0) return
// 从空格子中随机找到一个格子，有90%的概率是2，10%概率是4
  const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  board[r][c] = Math.random() < 0.9 ? 2 : 4

  newCell = {r, c}
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
        cell.id = `cell-${r}-${c}`
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
    if (isGameOver()) {
        showGameOver();
      }
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
      animateCellMove(r, 0, 1, 1)
      board[r] = row
      moved = true
    }
  }
  return moved
}
// 判断是否移动了，外层取反
function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, idx) => val === b[idx])
}
function moveRight() {
  rotateRows() // 反转每一行
  const moved = moveLeft()
  rotateRows() // 再次反转回来
  return moved
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

// 倒置每一行
function rotateRows() {
  for (let r = 0; r < 4; r++) {
    board[r].reverse()
  }
}
// 矩阵转换
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

function isGameOver() {
    // 有空格，游戏还没结束
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] === 0) return false;
      }
    }
  
    // 检查是否还能合并（横向）
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] === board[r][c + 1]) return false;
      }
    }
  
    // 检查是否还能合并（纵向）
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 3; r++) {
        if (board[r][c] === board[r + 1][c]) return false;
      }
    }
  
    return true; // 没空格也不能合并了 → 游戏结束
  }
  

  function showGameOver() {
    document.getElementById("game-over").classList.remove("hidden");
  }
  
  function hideGameOver() {
    document.getElementById("game-over").classList.add("hidden");
  }
  
  
function animateCellMove(fx, fy, tx, ty) {
    const cell = document.querySelector(`cell${fx}${fy}`)
    // 获取当前cell的宽度
    if (!cell) return
}