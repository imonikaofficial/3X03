import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Steps,
  Form,
  Input,
  Divider,
  Spin,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import VisaIcon from "./visacard.svg";
import MasterCardIcon from "./mastercard.svg";
import { TransactionAdd } from "../../API/API";

const { Content, Footer } = Layout;
const { Step } = Steps;

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get total rental cost from summary page
  const [bookingDetails, setBookingDetails] = useState({
    ...location.state?.bookingDetails,
  });

  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      setBookingDetails({
        ...location.state?.bookingDetails,
      });
      setLoading(false);
    }
  }, [location.state]);

  // State for credit card form values and errors
  const [form] = Form.useForm();
  const [cardType, setCardType] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [cardNumberTouched, setCardNumberTouched] = useState(false);

  // Function to validate and handle credit card submission
  const handlePayNow = async () => {
    try {
      setBtnLoading(true);
      // Validate the credit card number (basic validation)
      const values = await form.validateFields();

      // Determine card type (Visa, MasterCard, etc.)
      const cardType = validateCreditCard(values.cardNumber);
      setCardType(cardType);
      console.log(bookingDetails);

      // Create a transaction record in the database
      const transactionResponse = await TransactionAdd(
        bookingDetails.carId,
        bookingDetails.pickupDate,
        bookingDetails.dropoffDate,
        bookingDetails.totalCost
      );

      if (transactionResponse.status === 200) {
        setBtnLoading(false);
        // Implement payment logic here
        // Can integrate with a payment gateway to handle real payments

        // After successful payment, you can navigate to a confirmation page or any other page as needed.
        navigate("/success");
        return;
      }
      setBtnLoading(false);
      console.log("Form values:", values);
      console.log(transactionResponse);
      // After unsuccessful payment, you can navigate to error page or any other page as needed.
      navigate(
        `/error?message=Transaction failed&subTitle=${transactionResponse.result}`
      );
    } catch (error) {
      // Log any validation errors
      console.error("Validation error:", error);

      // Handle validation errors as needed
      setCardType("");
      setCardNumberError("Invalid card number");
    }
  };

  // Function to validate credit card number and determine its type
  const validateCreditCard = (creditCardNumber) => {
    if (/^4/.test(creditCardNumber)) {
      return "Visa";
    } else if (/^5/.test(creditCardNumber)) {
      return "MasterCard";
    } else if (/^2/.test(creditCardNumber)) {
      return "MasterCard";
    } else {
      return "Unknown";
    }
  };

  // Custom validation function for card number
  const validateCardNumber = (_, value) => {
    setCardNumberTouched(true);

    return new Promise((resolve, reject) => {
      // Simulate an asynchronous operation (e.g., an API call)
      setTimeout(() => {
        if (/^\d{16}$/.test(value)) {
          setCardNumberError(null);
          resolve(); // Resolve the Promise if validation passes
        } else {
          setCardNumberError("Invalid card number (must be exactly 16 digits)");
          reject("Invalid card number"); // Reject the Promise if validation fails
        }
      }, 1000); // Simulated async delay, replace with actual async logic
    });
  };

  // Function to handle changes in the credit card input
  const handleCardNumberChange = (e) => {
    const creditCardNumber = e.target.value;

    // Determine card type based on the first digit of the credit card number
    const newCardType = validateCreditCard(creditCardNumber);
    setCardType(newCardType);
  };

  // State variables for current step and completed steps
  // Set the current step to 1 (Summary) initially
  const [currentStep, setCurrentStep] = useState(2);
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

  return !loading ? (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Content>
        <div className="booking-container py-6">
          <Row gutter={32} justify="center">
            <Col span={16}>
              <Card className="mb-4">
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
                  />
                </Steps>
              </Card>
              {/* Payment Form */}
              <Card style={{ width: "100%", marginBottom: "20px" }}>
                {/* Display total amount */}
                <h4 className="text-left text-2xl font-semibold mb-4">
                  Total Amount: ${bookingDetails.totalCost} SGD
                </h4>
                <Divider />
                {/* Credit Card Form */}
                <Form form={form} onFinish={handlePayNow}>
                  <Form.Item
                    label="Credit Card Number"
                    name="cardNumber"
                    rules={[{ validator: validateCardNumber }]}
                    hasFeedback
                    validateStatus={cardNumberError ? "error" : ""}
                    help={cardNumberError}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Input
                        placeholder="Enter your credit card number"
                        onChange={handleCardNumberChange}
                      />
                      {/* Display card icons */}
                      {cardType === "Visa" && (
                        <img
                          src={VisaIcon}
                          alt="Visa Icon"
                          width="24"
                          height="24"
                          style={{ marginLeft: "8px" }}
                        />
                      )}
                      {cardType === "MasterCard" && (
                        <img
                          src={MasterCardIcon}
                          alt="MasterCard Icon"
                          width="24"
                          height="24"
                          style={{ marginLeft: "8px" }}
                        />
                      )}
                    </div>
                  </Form.Item>
                  <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your full name",
                      },
                      {
                        pattern: /^[A-Za-z ]+$/,
                        message:
                          "Full name must only contain alphabetical characters and spaces",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your full name" />
                  </Form.Item>
                  <Form.Item
                    label="CVV"
                    name="cvv"
                    rules={[
                      { required: true, message: "Please enter the CVV code" },
                      { len: 3, message: "CVV must be 3 digits" },
                    ]}
                  >
                    <Input placeholder="Enter the CVV code" />
                  </Form.Item>
                  <Divider />
                  {/* back button */}
                  <Button
                    type="primary"
                    className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                    style={{ float: "left", marginTop: 20 }}
                    onClick={() => navigate("/booking")}
                  >
                    Back
                  </Button>
                  {/* payment button */}
                  <Button
                    type="primary"
                    className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                    style={{ float: "right", marginTop: 20 }}
                    loading={btnLoading}
                    htmlType="submit"
                  >
                    Pay Now
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer className="text-center bg-gray-200 p-2">Car Rental ©2023</Footer>
    </Layout>
  ) : (
    <Layout className="layout">
      <Spin size="large" />
    </Layout>
  );
};

export default Checkout;
