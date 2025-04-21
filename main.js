let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]

let isInit = true
let score = 0
// 新生成的格子，之所以是数组是因为游戏初始化需要两个新格子
let newCell = []
// 要合并的格子集合
let mergedCells = []

let moveAnimations = []

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
    hideGameOver()
    init()
  }
  document.getElementById("restart-btn").onclick = () => {
    init()
  };
  // 监听方向键
  document.addEventListener("keydown", handleKeyPress)
};
  
function init() {
  isInit = true
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
  isInit = false
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
  board[r][c] = isInit ? 2 : (Math.random() < 0.9 ? 2 : 4)

  newCell.push({r, c})
}

function updateBoardView() {
  const container = document.getElementById("grid-container")
  container.innerHTML = ""

  // === 添加动画块 ===
  moveAnimations.forEach(({ from, to }) => {
    const val = board[to.r][to.c] // 目标位置上的值
    const cell = document.createElement("div")
    cell.className = `cell cell-${val}`
    cell.textContent = val

    const fromPos = getCellPosition(from.r, from.c)
    const toPos = getCellPosition(to.r, to.c)

    cell.style.top = fromPos.top
    cell.style.left = fromPos.left

    // 强制触发一次布局重绘（让 transition 生效）
    requestAnimationFrame(() => {
      cell.style.top = toPos.top
      cell.style.left = toPos.left
    })

    container.appendChild(cell)
  })

  // 等待动画结束后更新最终视图（静态格子）
  setTimeout(() => {
    container.innerHTML = ""

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = board[r][c]
        if (val === 0) continue

        const cell = document.createElement("div")
        cell.className = `cell cell-${val}`
        cell.textContent = val

        const pos = getCellPosition(r, c)
        cell.style.top = pos.top
        cell.style.left = pos.left

        // 新生成动画
        if (newCell && newCell.r === r && newCell.c === c) {
          cell.classList.add("new")
        }

        // 合并动画
        if (mergedCells.some(pos => pos.r === r && pos.c === c)) {
          cell.classList.add("merged")
        }

        container.appendChild(cell)
      }
    }

    moveAnimations = []
    mergedCells = []
    newCell = []

    document.getElementById("score").textContent = score
  }, 200)

//   for (let r = 0; r < 4; r++) {
//     for (let c = 0; c < 4; c++) {
//       const val = board[r][c]
//       const cell = document.createElement("div")
//       cell.className = "cell"
//       if (val !== 0) {
//         cell.textContent = val
//         cell.classList.add("cell-" + val)
//         cell.id = `cell-${r}-${c}`
//         // 遍历新格子数组，给予动画class
//         newCell.forEach((cl) => {
//             if (cl && cl.r === r && cl.c === c) {
//                 cell.classList.add('new')
//             }
//         })
//         // 渲染前判断当前这个格子是不是新合并成的格子
//         if (mergedCells.some(pos => pos.r === r && pos.c === c)) {
//             cell.classList.add('merged')
//         }
        
//       }
//       container.appendChild(cell)
//     }
//   }

//   document.getElementById("score").textContent = score
//   // 视图更新后重置记录数组
//   newCell = []
//   mergedCells = []
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

function moveCells() {
  let moved = false
  moveAnimations = []
  for (let r = 0; r < 4; r++) {
    // let row = board[r].filter(val => val !== 0) // 去掉 0
    let currentRow = board[r]
    let newRow = [0,0,0,0]
    let lastMergedIndex = -1
    let targetCol = 0
    for (let c = 0; c < 4; c++) {
        if(currentRow[c] === 0) continue
        let value = currentRow[c]
        let movedCol = targetCol

        if (
            movedCol > 0 && 
            newRow[movedCol - 1] === value && 
            lastMergedIndex !== movedCol - 1
        ) {
            newRow[movedCol - 1] *= 2
            score += newRow[movedCol - 1]
            lastMergedIndex = movedCol - 1
            mergedCells.push({ r, c: movedCol - 1})
            moveAnimations.push({
                from: {r, c},
                to: {r, c: movedCol - 1}
            })
            moved = true
        } else {
            newRow[movedCol] = value
            if(c !== movedCol) {
                moveAnimations.push({
                    from: {r, c},
                    to: {r, c: movedCol}
                })
                moved = true
            }
            targetCol++
        }
    }
    // row = row.filter(val => val !== 0) // 再去一次 0
    // while (row.length < 4) row.push(0)
    // if (!arraysEqual(board[r], row)) {
    //   board[r] = row
    //   moved = true
    // }
    board[r] = newRow
  }
  return moved
}
// 判断是否移动了，外层取反
function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, idx) => val === b[idx])
}

function moveLeft() {
    return moveCells()
}

function moveRight() {
  rotateRows() // 反转每一行
  const moved = moveCells()
  rotateRows() // 再次反转回来
  return moved
}


function moveUp() {
  transpose()
  const moved = moveCells()
  transpose()
  return moved
}

function moveDown() {
  transpose()
  rotateRows()
  const moved = moveCells()
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
  
function getCellPosition(r, c) {
    const size = 25;  // 每个格子占25%的宽高（含间距）
    const gap = 2.5;  // 每个间隙是2.5%
    return {
      top: r * size + gap + "%",
      left: c * size + gap + "%",
    }
}
  
function showGameOver() {
  document.getElementById("game-over").classList.remove("hidden");
}

function hideGameOver() {
  document.getElementById("game-over").classList.add("hidden");
}
