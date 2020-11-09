import React, { useRef } from 'react';
import { Layout } from 'antd';
import Canvas from './Canvas/Canvas';
import styles from './App.module.css';
import MenuBar from './MenuBar/MenuBar';
import Toolbar from './Toolbar/Toolbar';

const App: React.FC = () => {
  const { Sider, Content } = Layout;
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  return (
    <Layout id={styles.container}>
      <MenuBar canvasRef={canvasRef} />
      <Layout>
        <Sider id={styles.sider} collapsed={true}><Toolbar canvasRef={canvasRef} /></Sider>
        <Content id={styles.content}><Canvas canvasRef={canvasRef} /></Content>
      </Layout>
    </Layout>
  );
}

export default App;
