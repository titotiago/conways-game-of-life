interface Cell {
  x: number;
  y: number;
  alive: boolean;
}

class GameOfLife {
  width: number;
  height: number;
  cells: Cell[][];
  intervalId: number | null;
  tickSpeed: number;

  constructor(
    width: number,
    height: number,
    initialCells: Cell[][],
    tickSpeed: number
  ) {
    this.width = width;
    this.height = height;
    this.cells = initialCells;
    this.intervalId = null;
    this.tickSpeed = tickSpeed;
  }

  getNeighbors(x: number, y: number): Cell[] {
    const neighbors: Cell[] = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (!(i === 0 && j === 0)) {
          const neighborX = x + i;
          const neighborY = y + j;
          if (
            neighborX >= 0 &&
            neighborX < this.width &&
            neighborY >= 0 &&
            neighborY < this.height
          ) {
            neighbors.push({
              x: neighborX,
              y: neighborY,
              alive: this.cells[neighborX][neighborY].alive,
            });
          }
        }
      }
    }
    return neighbors;
  }

  countAliveNeighbors(x: number, y: number): number {
    return this.getNeighbors(x, y).filter((neighbor) => neighbor.alive).length;
  }

  tick(): void {
    this.updateCells();
  }

  updateCells(): void {
    const newCells: Cell[][] = [];
    for (let i = 0; i < this.width; i++) {
      newCells[i] = [];
      for (let j = 0; j < this.height; j++) {
        const aliveNeighbors = this.countAliveNeighbors(i, j);
        const alive = this.cells[i][j].alive;
        if (alive && (aliveNeighbors < 2 || aliveNeighbors > 3)) {
          newCells[i][j] = { ...this.cells[i][j], alive: false };
        } else if (!alive && aliveNeighbors === 3) {
          newCells[i][j] = { ...this.cells[i][j], alive: true };
        } else {
          newCells[i][j] = { ...this.cells[i][j] };
        }
      }
    }
    this.cells = newCells;
    this.drawGrid();
  }

  start(): void {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.updateCells();
      }, this.tickSpeed);
    }
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  toggleCell(x: number, y: number): void {
    this.cells[x][y].alive = !this.cells[x][y].alive;
    this.drawGrid();
  }

  setTickSpeed(tickSpeed: number): void {
    this.tickSpeed = tickSpeed;
    if (this.intervalId) {
      this.stop();
      this.start();
    }
  }

  drawGrid(): void {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const ctx = (canvas as HTMLCanvasElement).getContext("2d");
    if (!ctx) return;

    const cellSize = 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const isAlive = this.cells[x][y].alive;
        ctx.fillStyle = isAlive ? "#212121" : "#424242"; // Dark gray and Gray colors for dark mode
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

export default GameOfLife;
