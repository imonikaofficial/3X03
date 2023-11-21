import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Breadcrumb,
  Card,
  Row,
  Col,
  Button,
  Modal,
  Tabs,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import { CarOutlined } from "@ant-design/icons";
import { CarInfoGetAll } from "../../API/API";
import { getCookie } from "../Auth/TokenManager";

const { Header, Content, Footer } = Layout;
const { Meta } = Card;
const { TabPane } = Tabs;

function Catalog() {
  const navigate = useNavigate();
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCarData = useCallback(async () => {
    const response = await CarInfoGetAll();
    if (response?.status === 200) {
      const carData = response.result.filter(
        (car) => car.carStatus === "Active"
      );
      console.log(carData);
      setCarData(carData);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCarData();
  }, [fetchCarData]);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [activeTab, setActiveTab] = useState("All"); // Initialize with 'all' tab

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleViewDetails = (car) => {
    setSelectedCar(car);
    toggleDetails();
  };

  const handleCloseModal = () => {
    setSelectedCar(null);
    toggleDetails();
  };

  const handleBookNow = () => {
    // Implement your book now logic here
    // For example, you can open a new page or a booking form
    // Or you can add a URL to navigate to a booking page
    const accessToken = getCookie("token"); // Replace 'jwt' with the actual cookie name
    if (!accessToken || accessToken === "undefined") {
      navigate("/login?error=true&message=login first to book");
    } else {
      navigate(`/booking?carId=${selectedCar._id}`);
    }
  };

  const filterCarsByStyle = (style) => {
    // Filter the carData array based on the selected style
    if (style === "All") {
      return carData;
    } else {
      return carData.filter((car) => car.carStyle === style);
    }
  };
  const keys = ["All", "Sedans", "SUV", "Hatchback"];
  return !loading ? (
    <Layout className="layout">
      <Header className="bg-blue-500 p-4">
        <div className="text-white text-xl">
          <CarOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
          Car Catalog
        </div>
      </Header>
      <Content style={{ padding: "20px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Car Catalog</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            animated={{ tabPane: true }}
          >
            {keys.map((key) => (
              <TabPane tab={key} key={key}>
                <Row gutter={16}>
                  {filterCarsByStyle(key).map((car) => (
                    <Col span={8} key={car._id}>
                      <Card
                        hoverable
                        cover={
                          <div style={{ height: "350px", overflow: "hidden" }}>
                            <img
                              alt={`${car.carMake} ${car.carModel}`}
                              src={`/api/cars/image/${car.image}/${
                                car.contentType.split(".")[1]
                              }`}
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                              }}
                            />
                          </div>
                        }
                        onClick={() => handleViewDetails(car)}
                        className="mb-4"
                      >
                        <Meta
                          title={`${car.carMake} ${car.carModel}`}
                          description={car.carDescription}
                        />
                        <Button
                          type="primary"
                          className="mt-2"
                          style={{
                            backgroundColor: "#1890ff",
                            borderColor: "#1890ff",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(car);
                          }}
                        >
                          View Details
                        </Button>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>
            ))}
          </Tabs>
        </div>

        {selectedCar && (
          <Modal
            title={`${selectedCar.carMake} ${selectedCar.carModel} Details`}
            visible={showDetails}
            onCancel={handleCloseModal}
            footer={[
              <Button key="close" onClick={handleCloseModal}>
                Close
              </Button>,

              <Button
                type="primary"
                style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
                onClick={handleBookNow}
              >
                Book Now
              </Button>,
            ]}
          >
            <img
              alt={`${selectedCar.carMake} ${selectedCar.carModel}`}
              src={`/api/cars/image/${selectedCar.image}/${
                selectedCar.contentType.split(".")[1]
              }`}
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "contain",
              }}
            />
            <p>Description: {selectedCar.carDescription}</p>
            <p>Seats: {selectedCar.carSeats}</p>
            <p>Fuel: {selectedCar.carFuelType}</p>
            <p>Boot: {selectedCar.carBootSpace}</p>
            <p>Rental: ${selectedCar.carRentalPrice.toString()}/hour</p>
          </Modal>
        )}
      </Content>
      <Footer className="text-center bg-gray-200 p-2">Car Catalog ©2023</Footer>
    </Layout>
  ) : (
    <Layout className="layout">
      <Spin size="large" />
    </Layout>
  );
}

export default Catalog;
