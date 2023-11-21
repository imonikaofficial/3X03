import React from "react";
import { Button, Form, Layout, Row, Col, Card, Input, message } from "antd";
import { AdminRegister } from "../../API/API";

import "./Register.css";

const { Content, Footer } = Layout;

const AdminResetPassword = () => {
  // to replace with the expected key
  const expectedKey = "expectedKey"; 

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);

    if (values.key === expectedKey) {
      const response = await AdminRegister(
        values.email,
        values.key,
        values.password
      );

      if (response?.status === 200) {
        window.location.href =
          "/success?title=Website%20Ready&subtitle=Admin%20account%20created.";
      } else {
        console.log(response);
        message.error("Unable to reset password. Please try again.");
      }
    } else {
      message.error("Invalid key. Please enter the correct key.");
    }
  };

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
        <div className="booking-container py-6">
          <Row gutter={32} justify="center">
            <Col xs={24} sm={24} md={12} lg={8}>
              <Card
                title="Admin Account Password Reset"
                className="login-card"
                headStyle={{ textAlign: "center" }}
              >
                <Form
                  name="reset password"
                  onFinish={onFinish}
                  style={{
                    maxWidth: 600,
                  }}
                  scrollToFirstError
                >
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your email!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your email." />
                  </Form.Item>
                  <Form.Item
                    name="code"
                    label="Key"
                    rules={[
                      {
                        required: true,
                        message: "Please input key!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter admin key to reset password." />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Enter your password." />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="default"
                      htmlType="submit"
                      style={{ width: "100%" }}
                    >
                      Reset Password
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer className="text-center bg-gray-200 p-2">Car Rental ©2023</Footer>
    </Layout>
  );
};
export default AdminResetPassword;
