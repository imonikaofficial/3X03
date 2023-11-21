import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
} from "antd";

import { UploadOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { CarInfoGetById, CarInfoUpdate } from "../API/API";
import DOMPurify from 'dompurify';

const { Option } = Select;
const { Header, Content, Footer } = Layout;

const EditCar = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the car ID from the URL
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);

  const [car, setCar] = useState(null);

  const fetchCarDetails = useCallback(async (carId) => {
    const response = await CarInfoGetById(carId);
    if (response.status !== 200) {
      message.error("Unable to fetch car details.");
      return;
    }
    setCar(response.result);
  }, []);

  useEffect(() => {
    if (id) {
      fetchCarDetails(id);
    }
  }, [id]);

  // Handle image upload
  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      // Image upload is successful, set the image URL
      setImageUrl(info.file.response.imageUrl);
    } else if (info.file.status === "error") {
      message.error("Image upload failed.");
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    // You can access form values and the image URL here
    console.log("Form values:", values);
    console.log("Image URL:", imageUrl);
    // Add your logic to update the car with the edited data
    const response = await CarInfoUpdate(
      id,
      DOMPurify.sanitize(values.carMake),
      DOMPurify.sanitize(values.carStyle),
      DOMPurify.sanitize(values.carModel),
      DOMPurify.sanitize(values.carDescription),
      DOMPurify.sanitize(values.carSeats),
      DOMPurify.sanitize(values.carFuelType),
      DOMPurify.sanitize(values.carBootSpace),
      DOMPurify.sanitize(values.carRentalPrice),
      DOMPurify.sanitize(values.carStatus),
      imageUrl
    );
    if (response?.status !== 200) {
      message.error("Unable to update car details.");
      return;
    }
    message.success("Car details updated successfully.");
    // Then navigate back to the car management page
    navigate("/car-management");
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
                  Edit Car Details
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
                    {car && <Input placeholder={car.carMake} />}
                  </Form.Item>
                  <Form.Item
                    label="Car Style"
                    name="carStyle"
                    rules={[
                      { required: true, message: "Please enter car style" },
                    ]}
                  >
                    {car && <Input placeholder={car.carStyle} />}
                  </Form.Item>
                  <Form.Item
                    label="Car Model"
                    name="carModel"
                    rules={[
                      { required: true, message: "Please enter car model" },
                    ]}
                  >
                    {car && <Input placeholder={car.carModel} />}
                  </Form.Item>
                  <Form.Item
                    label="Car Description"
                    name="carDescription"
                    rules={[
                      {
                        required: true,
                        message: "Please enter car description",
                      },
                    ]}
                  >
                    {car && <Input placeholder={car.carDescription} />}
                  </Form.Item>
                  <Form.Item
                    label="Seats"
                    name="carSeats"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the number of seats",
                      },
                    ]}
                  >
                    {car && <Input type="number" placeholder={car.carSeats} />}
                  </Form.Item>
                  <Form.Item label="Fuel" name="carFuelType">
                    {car && <Input placeholder={car.carFuelType} />}
                  </Form.Item>
                  <Form.Item label="Boot Size" name="carBootSpace">
                    {car && <Input placeholder={car.carBootSpace} />}
                  </Form.Item>
                  <Form.Item label="Rental Price" name="carRentalPrice">
                    {car && (
                      <Input prefix="$" placeholder={car.carRentalPrice} />
                    )}
                  </Form.Item>
                  <Form.Item name="carStatus" label="Status">
                    <Select
                      defaultValue={car?.carStatus}
                      placeholder="Select your Country"
                    >
                      <Option value="Active">Active</Option>
                      <Option value="On Repair">On Repair</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Car Image">
                    <Upload
                      name="image"
                      action="/api/upload"
                      showUploadList={false}
                      onChange={handleImageUpload}
                    >
                      <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                  </Form.Item>
                  {/* TODO Car image link */}
                  {imageUrl && (
                    <div>
                      <p>Uploaded Image:</p>
                      <img
                        src={imageUrl}
                        alt="Car"
                        style={{ maxWidth: "100%" }}
                      />
                    </div>
                  )}
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
                      Save Changes
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

export default EditCar;
