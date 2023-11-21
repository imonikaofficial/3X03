import React from "react";
import { Layout, Result, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
const { Header, Content, Footer } = Layout;

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get("title") || "Success";
  const subtitle =
    queryParams.get("subtitle") || "Your booking has been confirmed.";
  console.log(title, subtitle);
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
            status="success"
            title={title}
            subTitle={subtitle}
            extra={[
              <Button key="buy" onClick={() => navigate("/")}>
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

export default Success;
