import React from "react";
import { Button, Form, Input, Typography, message, Card, Row, Col, Layout, Breadcrumb } from "antd"; // Import Breadcrumb
import { UserInfoUpdate } from "../../API/API";

const { Content, Footer } = Layout;

const PasswordChange = () => {
  const [form] = Form.useForm();

  const onFinishHandler = async (values) => {
    const response = await UserInfoUpdate(
      undefined,
      undefined,
      undefined,
      values["password"],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );

    if (response?.status === 200) {
      message.success("Password changed successfully!");
    } else {
      message.error("Password change failed!");
    }
  };

  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Content
        style={{
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="manage-user-request-container py-6">
          <Row gutter={32} justify="center">
            <Col xs={24} sm={24} md={24}>
              <Card className="mb-4" style={{ padding: "20px", margin: "0 20px"}}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Breadcrumb>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Profile</Breadcrumb.Item>
                    <Breadcrumb.Item>Change Password</Breadcrumb.Item>
                  </Breadcrumb>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h2 className="text-2xl font-semibold mb-0">Change Password</h2>
                </div>
                <Form
                  name="password_change"
                  autoComplete="off"
                  labelCol={{ span: 8 }}
                  style={{
                    maxWidth: "100%", 
                    paddingLeft: "10%",
                    paddingRight: "20%",
                    paddingTop: "5%",
                    paddingBottom: "5%",
                  }}
                  layout="horizontal"
                  onFinish={onFinishHandler}
                >
                  <Form.Item
                    hasFeedback
                    label="Old Password"
                    name="old password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your old password!",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    label="New Password"
                    name="password"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please enter your new password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          let re = /^(?!.*(.)\1{3})(?=.{8,64}$).*$/;

                          if (!value) {
                            return Promise.resolve();
                          }

                          if (!re.test(value)) {
                            return Promise.reject(
                              new Error("The new password must be 8-16 characters!")
                            );
                          }

                          if (getFieldValue("old password") === value) {
                            return Promise.reject(
                              new Error(
                                "The new password cannot be the same as the old password!"
                              )
                            );
                          }

                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    hasFeedback
                    label="Confirm New Password"
                    name="new password"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your new password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "The new password that you entered do not match!"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item>
                    <Button type="default" style={{ float: "right" }} htmlType="submit">
                      Change Password
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default PasswordChange;
