import React, { useState, useEffect, useCallback } from "react";
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
import { Descriptions } from "antd"; // Import Descriptions component
import { StaffInfoGetOne, StaffPasswordUpdate } from "../API/API";
import { deleteSessionCookie } from "../../user/features/Auth/TokenManager";

const { Header, Content, Footer } = Layout;

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null); // State to hold user details

  const fetchUserDetails = useCallback(async () => {
    const response = await StaffInfoGetOne();
    if (response?.status === 200) {
      console.log(response);
      const user = response.result;
      setUser(user[0]);
    } else {
      console.log(response);
      message.error(response.result || "Failed to fetch details");
    }
  }, []);

  useEffect(() => {
    // Fetch user details when the id parameter changes
    fetchUserDetails();
  }, [fetchUserDetails]);

  // const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()\-_+={}[\]|\\:;"<>,./?]).{8,}$/;
  const passwordPattern = /^(?!.*(.)\1{3})(?=.{8,64}$).*$/;

  const onFinish = async (values) => {
    // Simulate a loading state while processing the form
    setLoading(true);
    const response = await StaffPasswordUpdate(
      values.oldPassword,
      values.newPassword
    );
    console.log(response);
    if (response?.status !== 200) {
      message.error(response.result || "Unable to change password");
      setLoading(false);
      return;
    }
    // Replace this with your actual password change logic
    setTimeout(() => {
      // Reset the form and loading state
      form.resetFields();
      setLoading(false);

      // Show a success message
      message.success("Staff Password Successfully Changed");
    }, 1000); // Simulated delay
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const validateConfirmPassword = (_, value) => {
    const newPassword = form.getFieldValue("newPassword");
    if (value !== newPassword) {
      return Promise.reject("Passwords do not match");
    }
    return Promise.resolve();
  };

  const logout = () => {
    Modal.confirm({
      title: "Are you sure you want to logout?",
      okText: "Confirm",
      okButtonProps: {
        className: "bg-blue-500 hover:bg-blue-600 border-blue-500",
      },

      onOk: async () => {
        await deleteSessionCookie();
        window.location.href = "/";
      },
    });
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
              {/* Staff Details Card */}

              <Card className="mb-4">
                <Row gutter={32} justify="space-between" style={{ margin: 14 }}>
                  <h2
                    className="text-left text-2xl font-semibold mb-4"
                    style={{ marginBottom: 20 }}
                  >
                    Staff Details
                  </h2>
                  <Button type="dashed" onClick={logout}>
                    Logout
                  </Button>
                </Row>
                {user && (
                  <Descriptions bordered>
                    <Descriptions.Item label="Username">
                      {user.username}
                    </Descriptions.Item>
                    <Descriptions.Item label="First Name">
                      {user.firstname}
                    </Descriptions.Item>
                    <Descriptions.Item label="Last Name">
                      {user.lastname}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {user.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone Number">
                      {user.phone}
                    </Descriptions.Item>
                  </Descriptions>
                )}
              </Card>
              {/* Change Password Card */}
              <Card className="mb-4">
                <h2
                  className="text-left text-2xl font-semibold mb-4"
                  style={{ marginBottom: 30 }}
                >
                  Change Password
                </h2>
                <Form
                  form={form}
                  name="changePasswordForm"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  <Form.Item
                    label="Old Password"
                    name="oldPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your old password",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a new password",
                      },
                      {
                        min: 8,
                        message: "Password must be at least 8 characters long",
                      },
                      {
                        pattern: passwordPattern,
                        message:
                          "Password does not meet complexity requirements",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your new password",
                      },
                      { validator: validateConfirmPassword },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                      style={{ float: "right", marginTop: 20 }}
                    >
                      Submit
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

export default ChangePassword;
