import React, { useState } from 'react';
import { Row, Col, Typography, Space, Button, message } from 'antd';
import { PlusSquareOutlined, SaveOutlined } from '@ant-design/icons';
import styles from './MenuBar.module.css';
import NewCanvasModal from './NewCanvasModal';
import { v4 } from 'uuid';

const MenuBar: React.FC<{ canvasRef: React.MutableRefObject<HTMLCanvasElement | null> }> = ({ canvasRef }) => {
  const { Title } = Typography;
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <Row id={styles.container}>
      <Col span={12}><Title id={styles.title} level={3}>Canvas App</Title></Col>
      <Col span={12} style={{textAlign: "end"}}>
        <Space>
          <Button icon={<PlusSquareOutlined />} onClick={() => setVisible(true)}>New</Button>
          <Button 
            icon={<SaveOutlined />}
            onClick={() => {
              const image = canvasRef.current?.toDataURL("image/png");
              if (image) {
                const id = v4();
                const ids = localStorage.getItem("ids");
                const idArr = ids ? JSON.parse(ids) as string[] : [];
                localStorage.setItem("ids", JSON.stringify(idArr.concat(id)));
                localStorage.setItem(id, image);
                message.success("Successfully saved your painting!");
              } else {
                message.error("Failed to generate your painting!");
              }
            }}
          >Save</Button>
        </Space>
      </Col>
      <NewCanvasModal visible={visible} setVisible={setVisible} canvasRef={canvasRef} />
    </Row>
  );
};

export default MenuBar;