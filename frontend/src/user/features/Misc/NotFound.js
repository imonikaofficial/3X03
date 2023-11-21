import React from "react";
import { Layout, Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
const { Header, Content, Footer } = Layout;

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Content
        style={{
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="py-6">
          <Result
            status="error"
            title={"404 Not Found"}
            subTitle="Sorry, the page you are looking for does not exist"
            extra={[
              <Button
                key="console"
                onClick={() => {
                  navigate(`/`);
                }}
              >
                Return
              </Button>,
            ]}
          />
        </div>
      </Content>
      <Footer className="text-center bg-gray-200 p-2">Car Rental ©2023</Footer>
    </Layout>
  );
};

export default NotFound;
