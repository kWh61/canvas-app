import React from 'react';
import { Row } from 'antd';
import { BorderOutlined, StockOutlined, EditOutlined, UndoOutlined, RedoOutlined } from '@ant-design/icons';
import styles from './Toolbar.module.css';
import useStore from '../GlobalStore';
import { CanvasData, draw } from '../Canvas/CanvasUtils';

/**
 * Undo a drawing action.
 * @param canvasData data structure that supports the canvas element
 * @param setCanvasData function to set canvasData
 * @param canvasRef reference to the canvas element
 * @param canvasSize size of the canvas element
 */
const undo = (
  canvasData: CanvasData, 
  setCanvasData: (canvasData: CanvasData) => void, 
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  canvasSize: { width: number, height: number }
) => {
  const context = canvasRef.current?.getContext("2d");
  const { operations, operationPointer } = canvasData;
  if (!context) { return }
  context.clearRect(0, 0, canvasSize.width, canvasSize.height);
  operations.slice(0, operationPointer).forEach(op => draw[op.type](context, op));
  setCanvasData({...canvasData, operationPointer: operationPointer - 1});
};

/**
 * Redo a drawing action.
 * @param canvasData data structure that supports the canvas element
 * @param setCanvasData function to set canvasData
 * @param canvasRef reference to the canvas element
 */
const redo = (
  canvasData: CanvasData, 
  setCanvasData: (canvasData: CanvasData) => void, 
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
) => {
  const context = canvasRef.current?.getContext("2d");
  const { operations, operationPointer } = canvasData;
  if (!context) { return }
  const op = operations[operationPointer + 1];
  draw[op.type](context, op);
  setCanvasData({...canvasData, operationPointer: operationPointer + 1});
};

const HistoryButton: React.FC<{ isUndo: boolean, canvasRef: React.MutableRefObject<HTMLCanvasElement | null> }> = ({ isUndo, canvasRef }) => {
  const canvasSize = useStore(state => state.canvasSize);
  const canvasData = useStore(state => state.canvasData);
  const setCanvasData = useStore(state => state.setCanvasData);
  const isUndoDisabled = canvasData.operationPointer < 0;
  const isRedoDisabled = canvasData.operationPointer >= canvasData.operations.length - 1;
  return (
    <button
      className={(isUndo && !isUndoDisabled) || (!isUndo && !isRedoDisabled) ? styles.menuButton : styles.disabledMenuButton }
      onMouseDown={e => {
        e.preventDefault();
        isUndo && !isUndoDisabled && undo(canvasData, setCanvasData, canvasRef, canvasSize);
        !isUndo && !isRedoDisabled && redo(canvasData, setCanvasData, canvasRef);
      }}
    >
      {isUndo && <UndoOutlined style={{fontSize: "18px"}} />}
      {!isUndo && <RedoOutlined style={{fontSize: "18px"}} />}
    </button>
  );
};

const ModeButton: React.FC<{ mode: "rectangle"|"line"|"pen" }> = ({ mode }) => {
  const activeMode = useStore(state => state.mode);
  const setMode = useStore(state => state.setMode);
  return (
    <button
      className={mode === activeMode ? styles.activeMenuButton : styles.menuButton}
      onMouseDown={e => { e.preventDefault(); setMode(mode) }}
    >
      {mode === "rectangle" && <BorderOutlined style={{fontSize: "18px"}} />}
      {mode === "line" && <StockOutlined style={{fontSize: "18px"}} />}
      {mode === "pen" && <EditOutlined style={{fontSize: "18px"}} />}
    </button>
  );
};

const Toolbar: React.FC<{ canvasRef: React.MutableRefObject<HTMLCanvasElement | null> }> = ({ canvasRef }) => {
  return (
    <>
      <Row justify="center">
        <ModeButton mode={"rectangle"} />
      </Row>
      <Row justify="center">
        <ModeButton mode={"line"} />
      </Row>
      <Row justify="center">
        <ModeButton mode={"pen"} />
      </Row>
      <Row justify="center">
        <HistoryButton isUndo={true} canvasRef={canvasRef} />
      </Row>
      <Row justify="center">
        <HistoryButton isUndo={false} canvasRef={canvasRef} />
      </Row>
    </>
  );
};

export default Toolbar;