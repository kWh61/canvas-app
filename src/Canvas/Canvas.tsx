import React, { useRef } from 'react';
import { WIDTH, HEIGHT, CanvasData, Position, PointOperation } from './CanvasUtils';
import styles from './Canvas.module.css';

/**
 * Returns the current position of the mouse relative to the canvas element.
 * @param context context of the canvas element
 * @param e mouse event
 */
const findPosition = (context: CanvasRenderingContext2D, e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): Position => {
  const x = e.pageX - context.canvas.offsetLeft;
  const y = e.pageY - context.canvas.offsetTop;
  return { x, y };
};

const Canvas: React.FC<{ mode: "rectangle"|"line"|"pen" }> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const canvasData = useRef<CanvasData>({ operationPointer: -1, operations: [] });

  return (
    <canvas
      id="canvas"
      ref={canvasRef}
      style={{boxShadow: "0 .3125rem 1.25rem 0 rgba(0,0,0,.24)", margin: "10% 10%"}}
      onMouseDown={e => {
        const context = canvasRef.current?.getContext("2d");
        if (context) {
          const pos = findPosition(context, e);
          const op: PointOperation = {
            type: "rectangle",
            start: { x: pos.x, y: pos.y },
            end: { x: pos.x, y: pos.y },
            snapshot: context.getImageData(0, 0, WIDTH, HEIGHT)
          };
          canvasData.current.currentOperation = op;
        }
      }}
      onMouseMove={e => {
        const context = canvasRef.current?.getContext("2d");
        const op = canvasData.current.currentOperation;
        if (context && op) {
          const rectOp = op as PointOperation;
          const pos = findPosition(context, e);
          rectOp.snapshot && context.putImageData(rectOp.snapshot, 0, 0);
          context.strokeRect(rectOp.start.x, rectOp.start.y, pos.x - rectOp.start.x, pos.y - rectOp.start.y);
        }
      }}
      onMouseUp={e => {
        const context = canvasRef.current?.getContext("2d");
        const op = canvasData.current.currentOperation;
        if (context && op) {
          const rectOp = op as PointOperation;
          const pos = findPosition(context, e);
          rectOp.end = { x: pos.x, y: pos.y };
          rectOp.snapshot = undefined;
          canvasData.current.currentOperation = undefined;
          canvasData.current.operations.push(op);
          canvasData.current.operationPointer++;
          console.log("canvas", canvasData);
        }
      }}
    ></canvas>
  );
};

export default Canvas;