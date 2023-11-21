import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CarInfoAdd } from "../API/API";
import DOMPurify from 'dompurify';

const { Header, Content, Footer } = Layout;

const CreateCar = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [file, setFile] = useState(null); // Store back
  const [uploading, setUploading] = useState(false); // Track whether upload or not
  const [priceError, setPriceError] = useState("");

  // Handle form submission
  const handleSubmit = async (values) => {
    // Add your logic to create a new car with the data
    console.log(values);
    const formData = new FormData();
    formData.append("carMake", DOMPurify.sanitize(values.carMake),);
    formData.append("carStyle", DOMPurify.sanitize(values.carStyle),);
    formData.append("carModel", DOMPurify.sanitize(values.carModel),);
    formData.append("carDescription", DOMPurify.sanitize(values.carDescription),);
    formData.append("carSeats", DOMPurify.sanitize(values.seats));
    formData.append("carFuelType", DOMPurify.sanitize(values.carFuelType),);
    formData.append("carBootSpace", DOMPurify.sanitize(values.carBootSpace),);
    formData.append("carRentalPrice", DOMPurify.sanitize(values.rental));
    formData.append("file", file);

    setUploading(true);
    const response = await CarInfoAdd(formData);
    setUploading(false);
    if (response?.status !== 200) {
      message.error(response?.result || "Unable to create car.");
      console.log(response?.result);
      return;
    }
    message.success("Car created successfully.");
  };
  const props = {
    onRemove: () => {
      setFile(null);
    },
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    maxCount: 1,
    file,
  };

  // Custom validation function for card number
  const validateRentalPrice = (_, value) => {
    return new Promise((resolve, reject) => {
      // Simulate an asynchronous operation (e.g., an API call)
      setTimeout(() => {
        if (parseInt(value) < 1000 && parseInt(value) > 0) {
          setPriceError(null);
          resolve(); // Resolve the Promise if validation passes
        } else {
          setPriceError("Invalid Price Value (must be less than 3 digits)");
          reject("Invalid Price value"); // Reject the Promise if validation fails
        }
      }, 1000); // Simulated async delay, replace with actual async logic
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
              <Card className="mb-4">
                <h2
                  className="text-left text-2xl font-semibold mb-4"
                  style={{ marginBottom: 20 }}
                >
                  Create New Car
                </h2>
                {/* Content for Staff Management */}
                <Form form={form} onFinish={handleSubmit}>
                  <Form.Item
                    label="Car Make"
                    name="carMake"
                    rules={[
                      { required: true, message: "Please enter car make" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Car Style"
                    name="carStyle"
                    rules={[
                      { required: true, message: "Please enter car style" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Car Model"
                    name="carModel"
                    rules={[
                      { required: true, message: "Please enter car model" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Car Description"
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Please enter car description",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Seats"
                    name="seats"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the number of seats",
                      },
                    ]}
                  >
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item
                    label="Fuel"
                    name="fuel"
                    rules={[
                      { required: true, message: "Please enter fuel type" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Boot Size"
                    name="boot"
                    rules={[
                      { required: true, message: "Please enter boot size" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Rental Price"
                    name="rental"
                    rules={[{ validator: validateRentalPrice }]}
                    validateStatus={priceError ? "error" : ""}
                    help={priceError}
                  >
                    <Input prefix="$" type="number" />
                  </Form.Item>

                  {/* TODO IMAGE UPLOAD */}
                  <Form.Item label="Car Image">
                    <Upload {...props}>
                      <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => navigate("/car-management")}
                      className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                      style={{ float: "right", marginTop: 20 }}
                    >
                      Cancel
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                      style={{ float: "right", marginTop: 20 }}
                    >
                      Create New Car
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

export default CreateCar;
