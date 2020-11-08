interface Position {
  x: number,
  y: number
};

interface PointOperation {
  type: "rectangle"|"line",
  start: Position,
  end: Position,
  snapshot?: ImageData
};

interface PathOperation {
  type: "pen",
  positions: Position[]
}

type Operation = PointOperation|PathOperation;

export interface CanvasData {
  currentOperation?: Operation,
  operationPointer: number,
  operations: Operation[]
};

export const WIDTH = 500;
export const HEIGHT = 300;

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

interface mouseBehaviorProps {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  canvasData: CanvasData,
  setCanvasData: (canvasData: CanvasData) => void,
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
};

const rectangleMouseBehaviors = {
  "down": ({ canvasRef, canvasData, setCanvasData, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    if (context) {
      const pos = findPosition(context, e);
      const op: PointOperation = {
        type: "rectangle",
        start: pos,
        end: pos,
        snapshot: context.getImageData(0, 0, WIDTH, HEIGHT)
      };
      setCanvasData({...canvasData, currentOperation: op});
    }
  },
  "move": ({ canvasRef, canvasData, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    const op = canvasData.currentOperation;
    if (context && op) {
      const rectOp = op as PointOperation;
      const pos = findPosition(context, e);
      rectOp.snapshot && context.putImageData(rectOp.snapshot, 0, 0);
      context.strokeRect(rectOp.start.x, rectOp.start.y, pos.x - rectOp.start.x, pos.y - rectOp.start.y);
    }
  },
  "up": ({ canvasRef, canvasData, setCanvasData, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    const op = canvasData.currentOperation;
    context && op && setCanvasData({
      currentOperation: undefined,
      operationPointer: canvasData.operationPointer + 1,
      operations: canvasData.operations.concat({ ...(op as PointOperation), end: findPosition(context, e), snapshot: undefined })
    });
  }
};

const lineMouseBehaviors = {
  "down": ({ canvasRef, canvasData, setCanvasData, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    if (context) {
      const pos = findPosition(context, e);
      const op: PointOperation = {
        type: "line",
        start: pos,
        end: pos,
        snapshot: context.getImageData(0, 0, WIDTH, HEIGHT)
      };
      setCanvasData({...canvasData, currentOperation: op});
    }
  },
  "move": ({ canvasRef, canvasData, setCanvasData, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    const op = canvasData.currentOperation;
    if (context && op) {
      const lineOp = op as PointOperation;
      const pos = findPosition(context, e);
      lineOp.snapshot && context.putImageData(lineOp.snapshot, 0, 0);
      context.beginPath();
      context.moveTo(lineOp.start.x, lineOp.start.y);
      context.lineTo(pos.x, pos.y);
      context.closePath();
      context.stroke();
    }
  },
  "up": ({ canvasRef, canvasData, setCanvasData, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    const op = canvasData.currentOperation;
    context && op && setCanvasData({
      currentOperation: undefined,
      operationPointer: canvasData.operationPointer + 1,
      operations: canvasData.operations.concat({ ...(op as PointOperation), end: findPosition(context, e), snapshot: undefined })
    });
  }
};

const penMouseBehaviors = {
  "down": ({ canvasRef, canvasData, setCanvasData, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    if (context) {
      const pos = findPosition(context, e);
      const op: PathOperation = {
        type: "pen",
        positions: [pos]
      };
      setCanvasData({...canvasData, currentOperation: op});
    }
  },
  "move": ({ canvasRef, canvasData, setCanvasData, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    const op = canvasData.currentOperation;
    if (context && op) {
      const penOp = op as PathOperation;
      const lastPos = penOp.positions[penOp.positions.length - 1];
      const pos = findPosition(context, e);
      setCanvasData({...canvasData, currentOperation: {...penOp, positions: penOp.positions.concat(pos)}});
      context.beginPath();
      context.moveTo(lastPos.x, lastPos.y);
      context.lineTo(pos.x, pos.y);
      context.closePath();
      context.stroke();
    }
  },
  "up": ({ canvasRef, canvasData, setCanvasData, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    const op = canvasData.currentOperation;
    context && op && setCanvasData({
      currentOperation: undefined,
      operationPointer: canvasData.operationPointer + 1,
      operations: canvasData.operations.concat(op as PathOperation)
    });
  }
};

export const mouseBehaviorWrapper = {
  "rectangle": rectangleMouseBehaviors,
  "line": lineMouseBehaviors,
  "pen": penMouseBehaviors
};