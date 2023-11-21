// CreateStaff.js
import React, { useState } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
} from "antd";
import { StaffInfoRegister } from "../API/API";
import DOMPurify from 'dompurify';

const { Header, Content, Footer } = Layout;

const CreateStaff = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onFinish = (values) => {
    // Handle form submission to create a new staff account
    Modal.confirm({
      title: "Confirm New Staff Create",
      content: "Are you sure you want to create a new staff account?",
      okText: "Confirm",
      okButtonProps: {
        className: "bg-blue-500 hover:bg-blue-600 border-blue-500",
      },
      onOk: async () => {
        // console.log(values);
        const response = await StaffInfoRegister(
          DOMPurify.sanitize(values.firstname),
          DOMPurify.sanitize(values.lastName),
          values.email,
          values.phoneNumber
        );
        console.log(response);
        if (response?.status !== 200) {
          message.error(
            response.result || "Unable to create new staff account"
          );
          return;
        }
        // Replace this with your actual password change logic
        setTimeout(() => {
          // Reset the form and loading state
          form.resetFields();
          setLoading(false);

          // Show a success message
          message.success("New Staff Successfully Created");
        }, 1000); // Simulated delay
      },
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
            <Col xs={24} sm={24} md={16}>
              <Card className="mb-4">
                <h2
                  className="text-left text-2xl font-semibold mb-4"
                  style={{ marginBottom: 20 }}
                >
                  Create New Staff Account
                </h2>
                {/* Content for Staff Management */}
                <Form
                  form={form}
                  name="createStaffForm"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Please enter a valid email",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[
                      { required: true, message: "Please enter a first name" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[
                      { required: true, message: "Please enter a last name" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a phone number",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                      style={{ float: "right", marginTop: 20 }}
                    >
                      Create New Staff Account
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

export default CreateStaff;
