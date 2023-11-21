import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Layout,
  Row,
  Col,
  Card,
  message,
  Typography,
  Space,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { UserOTP, UserResendOTP } from "../../API/API";

const AuthOTP = () => {
  const { Content, Footer } = Layout;
  const { Text } = Typography;
  const { id } = useParams();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60);
  const [isTimer, setIsTimer] = useState(false);

  const handleTimer = () => {
    setIsTimer(true);
    setTimer(60); // Set the initial timer to 5 seconds

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setIsTimer(false);
    }, 60 * 1000); // 60 seconds in milliseconds
  };

  useEffect(() => {
    handleTimer();
  }, []);

  const handleResendOTP = async () => {
    setIsTimer(true); // Set isTimer to true to start the timer again
    handleTimer();
    const response = await UserResendOTP(id);
    if (response?.status !== 200) {
      message.error(response?.message || "Unable to resend OTP");
      return;
    }

    message.success("OTP sent successfully");
  };
  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    const response = await UserOTP(id, values.otp);

    if (response?.status !== 200) {
      message.error(response?.message || "OTP is incorrect");
      return;
    } else {
      message.success(
        response?.message || "OTP verified successfully. You're now logged in"
      );
      navigate("/");
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
                title="OTP Verification"
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
                  <div style={{ textAlign: "left" }}>
                    <Space direction="vertical" size="large">
                      <Text>
                        Please enter the OTP sent to your email address.
                      </Text>

                      <Text>
                        If you do not receive the email in a few minutes, please
                        check your spam folder or click on Resend OTP
                      </Text>
                    </Space>
                  </div>

                  <Row>
                    <Form.Item
                      label="OTP"
                      name="otp"
                      style={{ width: "60%" }}
                      rules={[
                        {
                          required: true,
                          max: 4,
                          min: 4,
                          message: "Please input OTP!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter OTP" />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="default"
                        className="login-form-button"
                        style={{ width: "100%" }}
                        disabled={isTimer}
                        onClick={handleResendOTP}
                      >
                        {isTimer ? `Resend in ${timer}s` : "Resend OTP"}
                      </Button>
                    </Form.Item>
                  </Row>
                  <Form.Item>
                    <Button
                      type="default"
                      htmlType="submit"
                      className="login-form-button"
                      style={{ width: "100%" }}
                    >
                      Verify
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

export default AuthOTP;
