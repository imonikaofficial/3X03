import React from "react";
import { Layout, Result, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
const { Header, Content, Footer } = Layout;

const Error = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const message = params.get("message") || "Oops... Something went wrong";
  const navBack = params.get("return") || "";
  const subTitle = params.get("subTitle") || "Invalid action";
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
            title={message}
            subTitle={subTitle}
            extra={[
              <Button
                type="primary"
                key="console"
                className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                onClick={() => {
                  navigate(`/${navBack}`);
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

export default Error;
