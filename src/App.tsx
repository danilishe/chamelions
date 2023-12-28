import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { Cursor } from './Cursor';

const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

interface Cube {
  color: string;
  arrowDirection: number;
  watchers: Set<Cube>;
}


const SIZE = 5;
const checkWinCondition = (board: Cube[][]) => {
  if (!board || board.length === 0) return false;
  const targetColor = board[0][0].color;
  return board.every(row => row.every(cube => cube.color === targetColor));
};

const startLooking = (row: number, col: number, board: Cube[][]) => {
  const cube = board[row][col];
  const target = getTargetCube(row, col, board);
  if (!target) { return; }

  target.watchers.add(cube);
  cube.color = target.color;

  updateDependant(cube);
}

const getTargetCube = (row: number, col: number, board: Cube[][]) => {
  const direction = board[row][col].arrowDirection;
  if (direction === 0 && row > 0) {
    return board[row - 1][col];
  }
  if (direction === 1 && col < SIZE - 1) {
    return board[row][col + 1];
  }
  if (direction === 2 && row < SIZE - 1) {
    return board[row + 1][col];
  }
  if (direction === 3 && col > 0) {
    return board[row][col - 1];
  }
}

const stopLooking = (row: number, col: number, board: Cube[][]) => {
  const targetCube = getTargetCube(row, col, board);
  if (targetCube) {
    targetCube.watchers.delete(board[row][col]);
  }
}


const App: React.FC = () => {
  const [board, setBoard] = useState<Cube[][]>([]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const initializeBoard = useCallback(() => {
    const newBoard: Cube[][] = [];
    for (let i = 0; i < SIZE; i++) {
      const row: Cube[] = [];
      for (let j = 0; j < SIZE; j++) {
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        const arrowDirection = Math.floor(Math.random() * 4);
        row.push({ color: randomColor, arrowDirection, watchers: new Set() });
      }
      newBoard.push(row);
    }

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const target = getTargetCube(i, j, newBoard);
        if (target) {
          target.watchers.add(newBoard[i][j]);
        }
      }
    }

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        startLooking(i, j, newBoard);
      }
    }

    setBoard(newBoard);
  }, [setBoard]);


  const rotateCube = (row: number, col: number, clockwise: boolean) => {
    stopLooking(row, col, board);

    const cube = board[row][col];
    let nextAngle = cube.arrowDirection + (clockwise ? 1 : -1);
    if (nextAngle > 3) { nextAngle = 0 };
    if (nextAngle < 0) { nextAngle = 3 };
    cube.arrowDirection = nextAngle;

    startLooking(row, col, board);
    setBoard([...board]);
  };

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  function fill(row: number, col: number, selectedColor: string) {
    const cube = board[row][col];
    if (!getTargetCube(row, col, board) && cube.color !== selectedColor) {
       cube.color = selectedColor;
       updateDependant(cube)
    }
    setBoard([...board]);
  }

  return (<>
    <Cursor selectedColor={selectedColor} />
    <div className="App">
      <div className="Board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="Row">
            {row.map((cube, colIndex) => (
              <div
                key={colIndex}
                className={`Cube`}
                style={{ backgroundColor: cube.color }}
                onClick={() => {
                  if (selectedColor) fill(rowIndex, colIndex, selectedColor);
                  else rotateCube(rowIndex, colIndex, true)
                }}
                onContextMenu={(e) => { e.preventDefault(); rotateCube(rowIndex, colIndex, false); }}
              >
                <div
                  className="Arrow"
                  style={{ transform: `rotate(${cube.arrowDirection * 90}deg)` }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="ColorPicker">
        {COLORS.map((color) => (
          <div
            key={color}
            className={`ColorOption`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
        <div className={`ColorOption`}
          style={{ backgroundColor: undefined }}
          onClick={() => setSelectedColor(undefined)} />
      </div>
      {checkWinCondition(board) && <>
        <div className="WinMessage">Congratulations! You've won!</div>
        <button type='button' className='btn btn-flat' onClick={initializeBoard}>Start again!</button>
      </>}
    </div>
  </>);
};

export default App;


function updateDependant(cube: Cube) {
  let children = cube.watchers;
  while (children.size > 0) {

    const grandChildren = new Set<Cube>();
    children.forEach(ch => {
      ch.color = cube.color;
      ch.watchers.forEach(chWatcher => {
        if (chWatcher.color !== cube.color) { // prevent dead loops
          grandChildren.add(chWatcher);
        }
      });
    });
    children = grandChildren;
  }
}

