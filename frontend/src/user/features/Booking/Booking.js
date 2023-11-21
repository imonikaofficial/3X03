import React, { useCallback, useEffect, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Form,
  DatePicker,
  Button,
  Card,
  Input,
  Select,
  Steps,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import "./booking.css";
import { CarInfoGetById } from "../../API/API";

const { Content, Footer } = Layout;

const { Step } = Steps;

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const carId = queryParams.get("carId") || "";

  const [selectedRange, setSelectedRange] = useState(null);
  const [carData, setCarData] = useState(null);
  const [transaction, setTransaction] = useState({
    carId: carId,
    pickupDate: "",
    dropoffDate: "",
    totalCost: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchCarData = useCallback(async () => {
    const response = await CarInfoGetById(carId);
    console.log(response);
    if (response.status === 200) {
      setCarData(response.result);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (carId === "") {
      navigate("/cars");
    }
    fetchCarData();
  }, [fetchCarData]);

  const handleRangeChange = (dates) => {
    setSelectedRange(dates);
  };

  const handleSubmit = () => {
    // Implement your booking submission logic here
    console.log("Selected Range:", selectedRange);
    // You can send this data to your backend for further processing
    navigate("/summary");
  };

  const validateDropoffDate = (rule, value) => {
    if (value && selectedRange && value.isBefore(selectedRange[0])) {
      return Promise.reject(
        "Drop-off date cannot be earlier than pick-up date"
      );
    }
    return Promise.resolve();
  };

  // State variables for current step and completed steps
  // Set the current step to 0 (Booking) initially
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Function to handle step changes and navigate to the corresponding pages
  const handleStepChange = (step) => {
    setCurrentStep(step);

    // Use conditional statements to navigate to the corresponding pages
    if (step === 0) {
      // Navigate to the Booking page
      navigate("/booking");
    } else if (step === 1) {
      // Navigate to the Summary page
      navigate("/summary");
    } else if (step === 2) {
      // Navigate to the Payment page
      navigate("/checkout");
    }
  };

  // Function to move to the next step and mark the current step as completed
  const handleNextStep = () => {
    const nextStep = currentStep + 1;
    setCompletedSteps([...completedSteps, currentStep]);
    setCurrentStep(nextStep);
  };

  return loading === false ? (
    <Layout className="layout">
      <Content>
        <div className="booking-container py-6">
          <Row gutter={32} justify="center">
            <Col span={16}>
              <Card className="mb-4" style={{ width: "100%", marginBottom: "20px"  }}>
                {/* progress bar */}
                <Steps current={currentStep} onChange={handleStepChange}>
                  <Step
                    title="Booking"
                    description="Select your desired car and details."
                  />
                  <Step
                    title="Summary"
                    description="Review your booking details."
                    disabled={!completedSteps.includes(1)}
                  />
                  <Step
                    title="Payment"
                    description="Complete your payment securely."
                    disabled={!completedSteps.includes(2)}
                  />
                </Steps>
              </Card>
              {/* selected car details */}
              <Card style={{ width: "100%", marginBottom: "20px" }}>
              <h2 className="text-left text-2xl font-semibold mb-4">
                Selected Car
              </h2>
                <Form layout="vertical" onFinish={handleSubmit}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        label="Car Model"
                        name="carModal"
                        initialValue={carData.carModel}
                      >
                        <Input placeholder="Car Model" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Rental Cost"
                        name="rentalCost"
                        initialValue={carData.carRentalPrice.toString()}
                      >
                        <Input placeholder="Rental Cost" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Car Details"
                        name="carDetails"
                        initialValue={carData.carDescription}
                      >
                        <Input placeholder="Car Details" disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
              {/* pick-up date */}
              <Card style={{ width: "100%", marginBottom: "20px" }}>
              <h2 className="text-left text-2xl font-semibold mb-4">
                Pick-up Details
              </h2>
                <Form layout="vertical" onFinish={handleSubmit}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="Pick-up Date" name="startDate">
                        <DatePicker
                          style={{ width: "100%" }} // Set the width to 100%
                          format="YYYY-MM-DD"
                          onChange={(date, dateString) => {
                            // Handle start date change
                            setTransaction({
                              ...transaction,
                              pickupDate: dateString,
                            });
                          }}
                          disabledDate={(current) =>
                            current && current < Date.now()
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
              {/* drop-off date */}
              <Card style={{ width: "100%", marginBottom: "20px" }}>
                <h2 className="text-left text-2xl font-semibold mb-4">
                  Drop-off Details
                </h2>
                <Form layout="vertical" onFinish={handleSubmit}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        label="Drop-off Date"
                        name="endDate"
                        rules={[{ validator: validateDropoffDate }]}
                      >
                        <DatePicker
                          style={{ width: "100%" }} // Set the width to 100%
                          format="YYYY-MM-DD"
                          onChange={(date, dateString) => {
                            setTransaction({
                              ...transaction,
                              dropoffDate: dateString,
                            });
                            // Handle end date change
                          }}
                          disabledDate={(current) =>
                            current &&
                            new Date(current.format("YYYY-MM-DD")) <
                              new Date(transaction.pickupDate)
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
              {/* back button */}
              <Button
                type="primary"
                className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                style={{ float: "left", marginTop: 20 }}
                onClick={() => navigate("/cars")}
              >
                Back
              </Button>
              {/* book now button */}
              <Button
                type="primary"
                className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                style={{ float: "right", marginTop: 20 }}
                onClick={() =>
                  navigate(`/summary`, {
                    state: { transaction: transaction, carData: carData },
                  })
                }
              >
                Book Now
              </Button>
              ,
            </Col>
          </Row>
        </div>
      </Content>
      <Footer className="text-center bg-gray-200 p-2">Car Rental ©2023</Footer>
    </Layout>
  ) : null;
};

export default Booking;
