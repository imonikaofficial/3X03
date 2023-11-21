import React from 'react';
import { Layout, Result, Button } from 'antd';

const { Header, Content, Footer } = Layout;

const Warning = () => (
  <Layout className="layout" style={{ minHeight: '100vh' }}>
    <Content
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div className="py-6">
        <Result
          status="warning"
          title="Warning..."
          subTitle="This is a sample warning message. Please proceed with caution."
          extra={[
            <Button 
            type="primary" 
            key="console" 
            className="bg-blue-500 hover:bg-blue-600 border-blue-500">
              Procceed
            </Button>,
            <Button key="buy">Back</Button>,
          ]}
        />
      </div>
    </Content>
    <Footer className="text-center bg-gray-200 p-2">Car Rental ©2023</Footer>
  </Layout>
);

export default Warning;
