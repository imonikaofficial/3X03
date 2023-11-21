import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Layout,
  Row,
  Col,
  Card,
  Input,
  Select,
  DatePicker,

  message,
} from "antd";


import { UserInfoRegister } from "../../API/API";
import "./Register.css";
import DOMPurify from 'dompurify';


const { Option } = Select;
const dateFormat = "YYYY-MM-DD";
const { Content, Footer } = Layout;

const Register = () => {
  const [form] = Form.useForm();
  const validatePassword = (rule, value) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

    if (value && !passwordRegex.test(value)) {
      return Promise.reject("Password must include at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long.");
    }

    return Promise.resolve();
  };

  const onFinish = async (values) => {
    console.log("Received values of the form: ", values);
    let dateofbirth = values.dateofbirth.format(dateFormat);
    console.log(dateofbirth);

    // Continue with the rest of the form submission
    const response = await UserInfoRegister(
      DOMPurify.sanitize(values.firstname),
      DOMPurify.sanitize(values.lastname),
      DOMPurify.sanitize(values.username),
      values.password,
      values.email,
      dateofbirth,
      DOMPurify.sanitize(values.address),
      values.postalcode,
      DOMPurify.sanitize(values.country),
      values.phone,
      "user"
    );

    if (response?.status === 200) {
      window.location.href =
        "/login?error=false&message=Register Success. Please confirm your email to login";
    } else {
      console.log(response);
      message.error("Unable to register. Please try again.");
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="65">+65</Option>
        <Option value="66">+66</Option>
      </Select>
    </Form.Item>
  );

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
                title="Register"
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
                    name="username"
                    label="Username"
                    rules={[
                      {
                        required: true,
                        message: "Please input your username!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your username." />
                  </Form.Item>
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
                        message: "Please input a valid email address!"
                      }
                    ]}
                  >
                    <Input placeholder="Enter your email." />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                      {
                        validator: validatePassword
                      }
                    ]}
                  >
                    <Input.Password placeholder="Enter your password." />
                  </Form.Item>
                  <Form.Item
                    name="firstname"
                    label="First Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your first name!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your first name." />
                  </Form.Item>
                  <Form.Item
                    name="lastname"
                    label="Last Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your last name!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your last name." />
                  </Form.Item>
                  <Form.Item
                    name="dateofbirth"
                    label="Date of Birth"
                    rules={[
                      {
                        required: true,
                        message: "Please input your date of birth!",
                      },
                    ]}
                  >
                    <DatePicker format={dateFormat} style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item
                    name="address"
                    label="Address"
                    rules={[
                      {
                        required: true,
                        message: "Please input your address!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your address." />
                  </Form.Item>
                  <Form.Item
                    name="postalcode"
                    label="Postal Code"
                    tooltip="Max 6 Digit"
                    rules={[
                      {
                        required: true,
                        message: "Please input your postal code!",
                      },
                      {
                        min: 6,
                        max: 6,
                        message: "Postal code should be 6 digits!",
                      },
                    ]}
                  >
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item
                    name="country"
                    label="Country"
                    rules={[
                      {
                        required: true,
                        message: "Please select your country!",
                      },
                    ]}
                  >
                    <Select placeholder="Select your Country">
                      <Option value="singapore">Singapore</Option>
                      <Option value="malaysia">Malaysia</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                      {
                        required: true,
                        message: "Please input your phone number!",
                      },
                      {
                        min: 8,
                        max: 8,
                        message: "Phone number should be 8 digits!",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      addonBefore={prefixSelector}
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>
                  {/* Add a line and bold title for License Card Verification */}

                  <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                      {
                        validator: (_, value) =>
                          value
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error("Should accept agreement")
                              ),
                      },
                    ]}
                  >
                    <Checkbox className="terms">
                      I have read the <a href="">agreement</a>
                    </Checkbox>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="default"
                      htmlType="submit"
                      style={{ width: "100%" }}
                    >
                      Register
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

export default Register;

