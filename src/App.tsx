import React from 'react';
import { Layout } from 'antd';
import Canvas from './Canvas/Canvas';
import styles from './App.module.css';
import MenuBar from './MenuBar/MenuBar';
import Toolbar from './Toolbar/Toolbar';

function App() {
  const { Sider, Content } = Layout;
  return (
    <Layout id={styles.container}>
      <MenuBar />
      <Layout>
        <Sider id={styles.sider} collapsed={true}><Toolbar /></Sider>
        <Content id={styles.content}><Canvas mode={"pen"} /></Content>
      </Layout>
    </Layout>
  );
}

export default App;
