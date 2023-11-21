import React from "react";
import { Button, Form, Layout, Row, Col, Card, Input, message } from "antd";
import { AdminRegister } from "../../API/API";

import "./Register.css";

const { Content, Footer } = Layout;

const AdminSetup = () => {
  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    const response = await AdminRegister(
      values.email,
      values.code,
      values.password
    );
    if (response?.status === 200) {
      window.location.href =
        "/success?title=Website%20Ready&subtitle=Admin%20account%20created.";
    } else {
      console.log(response);
      message.error("Unable to register. Please try again.");
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
                title="Admin Account"
                className="login-card"
                headStyle={{ textAlign: "center" }}
              >
                <Form
                  name="register"
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
                      {
                        type: "email",
                        message: "Please input a valid email"
                      }
                    ]}
                  >
                    <Input placeholder="Enter your email." />
                  </Form.Item>
                  <Form.Item
                    name="code"
                    label="Admin Token"
                    rules={[
                      {
                        required: true,
                        message: "Please input admin token!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter admin token." />
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
                      Create Admin Account
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
export default AdminSetup;
