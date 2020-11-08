export interface Position {
  x: number,
  y: number
};

export interface PointOperation {
  type: "rectangle"|"line",
  start: Position,
  end: Position,
  snapshot?: ImageData
};

export interface PathOperation {
  type: "pen",
  positions: Position[]
}

export type Operation = PointOperation|PathOperation;

export interface CanvasData {
  currentOperation?: Operation,
  operationPointer: number,
  operations: Operation[]
};

export const WIDTH = 500;
export const HEIGHT = 300;