import React from 'react';
import { Row, Col, Typography, Space, Button } from 'antd';
import { PlusSquareOutlined, SaveOutlined } from '@ant-design/icons';
import styles from './MenuBar.module.css';

const MenuBar: React.FC = () => {
  const { Title } = Typography;
  return (
    <Row id={styles.container}>
      <Col span={12}><Title id={styles.title} level={3}>Canvas App</Title></Col>
      <Col span={12} style={{textAlign: "end"}}>
        <Space>
          <Button icon={<PlusSquareOutlined />}>New</Button>
          <Button icon={<SaveOutlined />}>Save</Button>
        </Space>
      </Col>
    </Row>
  );
};

export default MenuBar;