import React from 'react';
import { Row } from 'antd';
import { BorderOutlined, StockOutlined, EditOutlined } from '@ant-design/icons';
import styles from './Toolbar.module.css';
import useStore from '../GlobalStore';

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

const Toolbar: React.FC = () => {
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
    </>
  );
};

export default Toolbar;