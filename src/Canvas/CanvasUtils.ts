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

interface mouseBehaviorProps {
  width: number,
  height: number,
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  canvasData: CanvasData,
  setCanvasData: (canvasData: CanvasData) => void,
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
};

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

/**
 * Updates canvasData at the end of an operation.
 * @param canvasData data structure that supports the canvas element
 * @param setCanvasData function to set canvasData
 * @param newOp new operation to be added to canvasData
 */
const updateCanvasData = ({ operations, operationPointer }: CanvasData, setCanvasData: (canvasData: CanvasData) => void, newOp: Operation) => {
  setCanvasData({
    currentOperation: undefined,
    operationPointer: operationPointer + 1,
    operations: operations.slice(0, operationPointer + 1).concat(newOp)
  });
};

// A mapping of three drawing functions corresponding to three modes.
export const draw = {
  "rectangle": (context: CanvasRenderingContext2D, op: Operation, pos?: Position) => {
    const rectOp = op as PointOperation;
    const end = pos ? pos : rectOp.end;
    context.strokeRect(rectOp.start.x, rectOp.start.y, end.x - rectOp.start.x, end.y - rectOp.start.y);
  },
  "line": (context: CanvasRenderingContext2D, op: Operation, pos?: Position) => {
    const lineOp = op as PointOperation;
    const end = pos ? pos : lineOp.end;
    context.beginPath();
    context.moveTo(lineOp.start.x, lineOp.start.y);
    context.lineTo(end.x, end.y);
    context.closePath();
    context.stroke();
  },
  "pen": (context: CanvasRenderingContext2D, op: Operation, pos?: Position) => {
    const penOp = op as PathOperation;
    const posArr = pos ? [penOp.positions[penOp.positions.length - 1], pos] : penOp.positions;
    for (let i = 0; i < posArr.length - 1; ++i) {
      context.beginPath();
      context.moveTo(posArr[i].x, posArr[i].y);
      context.lineTo(posArr[i + 1].x, posArr[i + 1].y);
      context.closePath();
      context.stroke();
    }
  }
};

// A mapping of mouse behaviors of the rectangle mode.
const rectangleMouseBehaviors = {
  "down": ({ width, height, canvasRef, canvasData, setCanvasData, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) { return }
    const pos = findPosition(context, e);
    const op: PointOperation = {
      type: "rectangle",
      start: pos,
      end: pos,
      snapshot: context.getImageData(0, 0, width, height)
    };
    setCanvasData({...canvasData, currentOperation: op});
  },
  "move": ({ canvasRef, canvasData: { currentOperation }, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    if (!context || !currentOperation) { return }
    const rectOp = currentOperation as PointOperation;
    rectOp.snapshot && context.putImageData(rectOp.snapshot, 0, 0);
    draw["rectangle"](context, rectOp, findPosition(context, e));
  },
  "up": ({ canvasRef, canvasData, setCanvasData, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    const op = canvasData.currentOperation;
    context && op && updateCanvasData(
      canvasData, 
      setCanvasData, 
      { ...(op as PointOperation), end: findPosition(context, e), snapshot: undefined }
    );
  }
};

// A mapping of mouse behaviors of the line mode.
const lineMouseBehaviors = {
  "down": ({ width, height, canvasRef, canvasData, setCanvasData, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) { return }
    const pos = findPosition(context, e);
    const op: PointOperation = {
      type: "line",
      start: pos,
      end: pos,
      snapshot: context.getImageData(0, 0, width, height)
    };
    setCanvasData({...canvasData, currentOperation: op});
  },
  "move": ({ canvasRef, canvasData: { currentOperation }, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    if (!context || !currentOperation) { return }
    const lineOp = currentOperation as PointOperation;
    lineOp.snapshot && context.putImageData(lineOp.snapshot, 0, 0);
    draw["line"](context, lineOp, findPosition(context, e));
  },
  "up": ({ canvasRef, canvasData, setCanvasData, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    const op = canvasData.currentOperation;
    context && op && updateCanvasData(
      canvasData, 
      setCanvasData,
      { ...(op as PointOperation), end: findPosition(context, e), snapshot: undefined }
    );
  }
};

// A mapping of mouse behaviors of the pen mode.
const penMouseBehaviors = {
  "down": ({ canvasRef, canvasData, setCanvasData, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) { return }
    const pos = findPosition(context, e);
    const op: PathOperation = { type: "pen", positions: [pos]};
    setCanvasData({...canvasData, currentOperation: op});
  },
  "move": ({ canvasRef, canvasData, setCanvasData, e }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    if (!context || !canvasData.currentOperation) { return }
    const penOp = canvasData.currentOperation as PathOperation;
    const pos = findPosition(context, e);
    draw["pen"](context, penOp, pos);
    setCanvasData({...canvasData, currentOperation: {...penOp, positions: penOp.positions.concat(pos)}});
  },
  "up": ({ canvasRef, canvasData, setCanvasData }: mouseBehaviorProps) => {
    const context = canvasRef.current?.getContext("2d");
    const op = canvasData.currentOperation;
    context && op && updateCanvasData(canvasData, setCanvasData, op);
  }
};

// A wrapper of the mappings of mouse behaviors.
export const mouseBehaviorWrapper = {
  "rectangle": rectangleMouseBehaviors,
  "line": lineMouseBehaviors,
  "pen": penMouseBehaviors
};