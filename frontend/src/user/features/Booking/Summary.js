import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Row, Col, Button, Card, Divider, Steps } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Content, Footer } = Layout;
const { Step } = Steps;

const Summary = () => {
  const navigate = useNavigate();

  // State variables for current step and completed steps
  // Set the current step to 1 (Summary) initially
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Function to handle step changes and navigate to the corresponding pages
  const handleStepChange = (step) => {
    setCurrentStep(step);

    // Use conditional statements to navigate to the corresponding pages
    if (step === 0) {
      // Navigate to the Booking page
      navigate(`/booking?carId=${selectedCar._id}`);
    } else if (step === 1) {
      // Navigate to the Summary page
      navigate("/summary");
    } else if (step === 2) {
      // Navigate to the Payment page
      navigate(`/checkout?totalCost=${bookingDetails.totalCost}`);
    }
  };
  const location = useLocation();

  const selectedCar = {
    ...location.state?.carData,
  };

  const [bookingDetails, setBookingDetails] = useState({
    ...location.state?.transaction,
  });

  const [durationHours, setDurationHours] = useState(0);

  useEffect(() => {
    if (location.state) {
      // Calculate duration in hours based on pick-up and drop-off date and time
      const pickupDateTime = moment(
        `${bookingDetails.pickupDate}`,
        "YYYY-MM-DD"
      );
      const dropoffDateTime = moment(
        `${bookingDetails.dropoffDate}`,
        "YYYY-MM-DD"
      );

      // Set the duration in hours
      let days = dropoffDateTime.diff(pickupDateTime, "days");

      setDurationHours(days + 1);

      const totalCost = durationHours * selectedCar.carRentalPrice;
      setBookingDetails({
        ...location.state?.transaction,
        totalCost: totalCost,
      });
    }
  }, [location.state, durationHours]);

  // Function to navigate to the checkout page with the total rental cost
  const handleProceedToPayment = () => {
    navigate(`/checkout`, { state: { bookingDetails } });
  };

  return location.state ? (
    <Layout className="layout">
      <Content>
        <div className="booking-container py-6">
          <Row gutter={8} justify="center">
            <Col span={16}>
              <Card
                className="mb-4"
                style={{ width: "100%", marginBottom: "20px" }}
              >
                {/* progress bar */}
                <Steps current={currentStep} onChange={handleStepChange}>
                  <Step
                    title="Booking"
                    description="Select your desired car and details."
                  />
                  <Step
                    title="Summary"
                    description="Review your booking details."
                  />
                  <Step
                    title="Payment"
                    description="Complete your payment securely."
                    disabled={!completedSteps.includes(2)}
                  />
                </Steps>
              </Card>
              {/* Booking Summary Card */}
              <Card
                className="mb-4"
                style={{ width: "100%", marginBottom: "20px" }}
              >
                <h2 className="text-left text-2xl font-semibold mb-4">
                  Booking Summary
                </h2>
                <Row gutter={8}>
                  <Col span={6} className="text-left">
                    <img
                      src={`/api/cars/image/${selectedCar.image}/${
                        selectedCar.contentType.split(".")[1]
                      }`}
                      alt="Car"
                      className="w-full rounded-lg"
                    />
                  </Col>
                  <Col span={6} className="text-left">
                    <h3 className="text-lg font-semibold">
                      {selectedCar.carModel}
                    </h3>
                    <p>{selectedCar.carDescription}</p>
                  </Col>
                  <Col span={6}></Col>
                  <Col span={6} className="text-right">
                    <p className="font-semibold">
                      ${selectedCar.carRentalPrice}/Day
                    </p>
                  </Col>
                </Row>
                <Divider />
                {/* Booking Details */}
                <Row gutter={8}>
                  <Col span={6} className="text-left">
                    <p className="font-semibold">
                      Pick-up Date: {bookingDetails.pickupDate}
                    </p>
                  </Col>
                  <Col span={6}></Col>
                </Row>
                <Row gutter={8}>
                  <Col span={6} className="text-left">
                    <p className="font-semibold">
                      Drop-off Date: {bookingDetails.dropoffDate}
                    </p>
                  </Col>

                  <Col span={6}></Col>
                </Row>
              </Card>

              {/* Total Amount Card */}
              <Card style={{ width: "100%", marginBottom: "20px" }}>
                <h2 className="text-left text-2xl font-semibold mb-4">
                  Total Amount
                </h2>
                <Row gutter={8}>
                  <Col span={6} className="text-left">
                    <p className="font-semibold">
                      Duration Booked: {durationHours} day(s)
                    </p>
                    <p className="font-semibold">
                      {durationHours} day(s) x ${selectedCar.carRentalPrice}/Day
                    </p>
                  </Col>
                  <Col span={6}></Col>
                  <Col span={6}></Col>
                  <Col span={6} className="text-right">
                    <p className="font-semibold">
                      ${selectedCar.carRentalPrice}/Day
                    </p>
                    <p className="font-semibold">${bookingDetails.totalCost}</p>
                  </Col>
                </Row>
                <Divider />
                <Row gutter={8}>
                  <Col span={6} className="text-left">
                    <p className="font-semibold" style={{ fontSize: "24px" }}>
                      Total Amount:
                    </p>
                  </Col>
                  <Col span={6}></Col>
                  <Col span={6}></Col>
                  <Col span={6} className="text-right">
                    <p className="font-semibold" style={{ fontSize: "24px" }}>
                      ${bookingDetails.totalCost} SGD
                    </p>
                  </Col>
                </Row>
              </Card>
              {/* back button */}
              <Button
                type="primary"
                className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                style={{ float: "left", marginTop: 20 }}
                onClick={() => navigate(`/booking?carId=${selectedCar._id}`)}
              >
                Back
              </Button>
              {/* continue to payment button */}
              <Button
                type="primary"
                className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                style={{ float: "right", marginTop: 20 }}
                onClick={handleProceedToPayment}
              >
                Continue to Payment
              </Button>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer className="text-center bg-gray-200 p-2">Car Rental ©2023</Footer>
    </Layout>
  ) : (
    <h1>Error loading page</h1>
  );
};

export default Summary;
