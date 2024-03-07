import React, { useRef, useEffect, useState } from "react";
import GameOfLife from "./gameOfLife";
import "./Game.css";

const InfiniteGridCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [game, setGame] = useState<GameOfLife | null>(null);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [lastTile, setLastTile] = useState<{ x: number; y: number } | null>(
    null
  );
  const [pause, setPause] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [tickSpeed, setTickSpeed] = useState<number>(30);
  const [cellSize] = useState<number>(20);
  const [viewport] = useState<{ width: number; height: number }>({
    width: 40,
    height: 40,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!game) {
      const initialCells: { x: number; y: number; alive: boolean }[][] = [];
      for (let i = 0; i < viewport.width; i++) {
        initialCells[i] = [];
        for (let j = 0; j < viewport.height; j++) {
          initialCells[i][j] = { x: i, y: j, alive: false };
        }
      }
      const gameInstance = new GameOfLife(
        viewport.width,
        viewport.height,
        initialCells,
        tickSpeed
      );
      setGame(gameInstance);
    }
  }, [tickSpeed, game, viewport]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !game) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let x = 0; x < viewport.width; x++) {
        for (let y = 0; y < viewport.height; y++) {
          if (game.cells[x] !== undefined && game.cells[x][y] !== undefined) {
            const isAlive = game.cells[x][y].alive;
            ctx.fillStyle = isAlive ? "#212121" : "#424242";
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            ctx.strokeStyle = "#000";
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
      }
    };

    drawGrid();
  }, [canvasRef, cellSize, game, viewport]);

  const handlePlayPause = () => {
    if (game) {
      if (pause) {
        game.start();
        setPause(false);
      } else {
        game.stop();
        setPause(true);
      }
    }
  };

  const handleTickSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTickSpeed = parseInt(e.target.value);
    if (!isNaN(newTickSpeed) && game) {
      game.setTickSpeed(newTickSpeed);
      setTickSpeed(newTickSpeed);
    }
  };

  const handleSkipTick = () => {
    if (game) {
      game.tick();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsMouseDown(true);
    handleMouseClick(e);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isMouseDown) {
      setIsDragging(true);
      handleMouseClick(e);
    }
  };

  const handleMouseClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !game) return;

    const canvasRect = canvas.getBoundingClientRect();
    const clickX = e.clientX - canvasRect.left;
    const clickY = e.clientY - canvasRect.top;
    const tileX = Math.floor(clickX / cellSize);
    const tileY = Math.floor(clickY / cellSize);
    if (
      !lastTile ||
      lastTile.x !== tileX ||
      lastTile.y !== tileY ||
      !isDragging
    ) {
      game.toggleCell(tileX, tileY);
      setLastTile({ x: tileX, y: tileY });
    }
  };

  return (
    <div className="container">
      <canvas
        ref={canvasRef}
        width={viewport.width * cellSize}
        height={viewport.height * cellSize}
        className="canvas"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onClick={handleMouseClick}
      />
      <div className="controls">
        <button className="play-pause" onClick={handlePlayPause}>
          {!pause ? "Pause" : "Play"}
        </button>
        <button className="skip-tick" onClick={handleSkipTick}>
          Next
        </button>
        <label className="tick-speed">
          Tick Speed (ms):
          <input
            type="number"
            defaultValue={tickSpeed}
            onChange={handleTickSpeedChange}
            className="tick-input"
          />
        </label>
      </div>
    </div>
  );
};

export default InfiniteGridCanvas;
