import React, { useState, useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Layout,
  Row,
  Col,
  Card,
  message,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import { UserLogin } from "../../API/API";

const { Content, Footer } = Layout;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const messageNotification = queryParams.get("message") || "";

  const login = async (email, password) => {
    setLoading(true);
    const response = await UserLogin(email, password);
    if (response?.status !== 200) {
      setLoading(false);
      console.log(response);
      message.error(response?.message || "Unable to login");
      return;
    } else {
      setLoading(false);
      message.success(response?.message || "OTP sent successfully");
      navigate("/auth-otp/" + response.result._id);
    }
  };

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    await login(values.Email, values.Password);
  };

  useEffect(() => {
    setError(messageNotification);
  }, [messageNotification]);

  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      {console.log(error)}
      {error
        ? error == true
          ? message.error(messageNotification)
          : message.success(messageNotification)
        : null}
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
                title="Login"
                className="login-card"
                headStyle={{ textAlign: "center" }}
              >
                <Form
                  name="normal_login"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={onFinish}
                >
                  <Form.Item
                    label="Email"
                    name="Email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Email!",
                      },
                      {
                        type: "email",
                        message: "Please input a valid email address!"
                      }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      placeholder="Enter your Email"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Password!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Enter your Password"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Checkbox
                      name="remember"
                      valuePropName="checked"
                      style={{ float: "left" }}
                    >
                      Remember me
                    </Checkbox>

                    <a href="/forgot-password" style={{ float: "right" }}>
                      Forgot password
                    </a>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="default"
                      htmlType="submit"
                      className="login-form-button"
                      loading={loading}
                      style={{ width: "100%" }}
                    >
                      Login
                    </Button>
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                      Or <a href="/Register">register now!</a>
                    </div>
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

export default Login;
