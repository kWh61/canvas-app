import React, { useState } from 'react';
import { Modal, Slider, message } from 'antd';
import useStore from '../GlobalStore';

interface NewCanvasModalProps {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
};

const NewCanvasModal: React.FC<NewCanvasModalProps> = ({ visible, setVisible, canvasRef }) => {
  const [width, setWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(300);
  const canvasSize = useStore(state => state.canvasSize);
  const setCanvasSize = useStore(state => state.setCanvasSize);
  const setCanvasData = useStore(state => state.setCanvasData);
  return (
    <Modal
      title="Create a new canvas!"
      visible={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      onOk={() => {
        const context = canvasRef.current?.getContext("2d");
        if (context) {
          context.clearRect(0, 0, canvasSize.width, canvasSize.height);
          setCanvasSize(width, height);
          setCanvasData({operationPointer: -1, operations: []});
          setVisible(false);
          message.success("Successfully created a new canvas!");
        } else {
          message.error("Failed to create a new canvas!");
        }
      }}
    >
      <span>Width (in px): </span>
      <Slider
        min={300}
        max={Math.floor(window.innerWidth * 0.9 - 100)}
        onChange={(value: number) => setWidth(value)}
        value={width}
      />
      <span>Height (in px): </span>
      <Slider
        min={200}
        max={Math.floor(window.innerHeight * 0.9 - 100)}
        onChange={(value: number) => setHeight(value)}
        value={height}
      />
    </Modal>
  );
};

export default NewCanvasModal;