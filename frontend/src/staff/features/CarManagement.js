import React, { useCallback, useEffect, useState } from "react";
import { Layout, Row, Col, Card, Button, Table, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import "./CarManagement.css";
import { CarInfoDelete, CarInfoGetAll } from "../API/API";

const { Header, Content, Footer } = Layout;

const CarManagement = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);

  const fetchCars = useCallback(async () => {
    const response = await CarInfoGetAll();
    console.log(response);
    if (response?.status === 200) {
      const cars = response.result.filter(
        (item) => item.carStatus !== "Inactive"
      );
      setData(cars);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const carColumns = [
    {
      title: "Car Image",
      dataIndex: "image",
      key: "image",
      render: (data, record) => {
        // console.log(record);
        const ct = record.contentType.split(".")[1];
        return (
          <img
            src={`/api/cars/image/${data}/${ct}`}
            alt="Car"
            className="car-image"
          />
        );
      },
    },
    {
      title: "Car Model",
      dataIndex: "carModel",
      key: "carModel",
    },
    {
      title: "Description",
      dataIndex: "carDescription",
      key: "description",
    },
    {
      title: "Seats",
      dataIndex: "carSeats",
      key: "seats",
    },
    {
      title: "Fuel",
      dataIndex: "carFuelType",
      key: "fuel",
    },
    {
      title: "Boot Size",
      dataIndex: "carBootSpace",
      key: "boot",
    },
    {
      title: "Rental Price",
      dataIndex: "carRentalPrice",
      key: "rental",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditCar(record._id)}
            className="bg-blue-500 hover:bg-blue-600 border-blue-500"
            style={{ marginRight: "8px" }}
          >
            Edit
          </Button>
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCar(record._id)}
            danger
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleCreateCar = () => {
    navigate("/create-car");
  };

  const handleEditCar = (key) => {
    navigate(`/edit-car/${key}`);
  };

  const handleDeleteCar = (key) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this car?",
      okText: "Confirm",
      okButtonProps: {
        className: "bg-red-500 hover:bg-red-600 border-red-500 confirm-button",
      },
      onOk: async () => {
        const response = await CarInfoDelete(key);
        if (response?.status !== 200) {
          message.error(response?.result || "Failed to delete car");
          return;
        }
        fetchCars();
        // const updatedData = data.filter((item) => item.key !== key);
        // setData(updatedData);
        message.success("Car Successfully Deleted");
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
        <div className="car-management-container py-6">
          <Row gutter={32} justify="center">
            <Col xs={24} sm={24} md={16}>
              <Card className="mb-4">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h2 className="text-2xl font-semibold mb-0">
                    Car Management
                  </h2>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                    onClick={handleCreateCar}
                  >
                    Create New Car
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <Table columns={carColumns} dataSource={data} rowKey="key" />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer className="text-center bg-gray-200 p-2">Car Rental ©2023</Footer>
    </Layout>
  );
};

export default CarManagement;
