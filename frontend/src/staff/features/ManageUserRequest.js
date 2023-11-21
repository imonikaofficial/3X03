import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Descriptions,
  Button,
  Modal,
  message,
  Image,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { LicenseInfoGet, LicenseUpdate } from "../API/API";
import { LicenseDownload } from "../API/routes/APILicense";
const { Header, Content, Footer } = Layout;

const ManageUserRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Define state for user details and image URLs
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("Unable to get license info");
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const fetchLicenseData = useCallback(async () => {
    // To make an API call to get the user details and image URLs
    console.log(id);
    const response = await LicenseInfoGet(id);
    console.log(response);
    if (response?.status !== 200) {
      setErrorMsg(response?.result);
      message.error(errorMsg);
      // navigate(`/manage-requests?message=${errorMsg}&return=manage-requests`);
      return;
    } else {
      console.log(response.result);
      setUserDetails(response.result);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // and update the state accordingly.
    fetchLicenseData();
  }, [fetchLicenseData]);

  useEffect(() => {
    // Fetch the front URL using the LicenseDownload function
    LicenseDownload(id,"front")
      .then((url) => {
        const blob = new Blob([url]);
        // Set the retrieved URL to the state
        setFront(blob);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });

      // Fetch the back URL using the LicenseDownload function
    LicenseDownload(id,"back")
    .then((url) => {
      const blob = new Blob([url]);
        // Set the retrieved URL to the state
        setBack(blob);
    })
    .catch((error) => {
      console.error("Error fetching image:", error);
    });
  }, [id]);

  const handleApproveRequest = () => {
    // Handle approving the user request.
    // To make an API call to update the user's status to "Approved".

    Modal.confirm({
      title: "Confirm Approval",
      content: "Are you sure you want to approve this request?",
      okText: "Confirm",
      okButtonProps: {
        className: "bg-blue-500 hover:bg-blue-600 border-blue-500",
      },
      onOk: async () => {
        // After successful approval, navigate back to the ManageRequests page
        const response = await LicenseUpdate({
          _id: id,
          isVerified: "Approved",
        });
        if (response?.status !== 200) {
          console.log(response);
          message.error(response?.message || "Unable to update license info");
          return;
        }
        navigate("/manage-requests");
        message.success("Request Successfully Approved");
      },
    });
  };

  const handleRejectRequest = () => {
    // Handle rejecting the user request.
    // To make an API call to update the user's status to "Rejected".

    Modal.confirm({
      title: "Confirm Rejection",
      content: "Are you sure you want to reject this request?",
      okText: "Confirm",
      okButtonProps: {
        className: "bg-red-500 hover:bg-red-600 border-red-500 confirm-button",
      },
      onOk: async () => {
        const response = await LicenseUpdate({
          _id: id,
          isVerified: "Rejected",
        });

        if (response?.status !== 200) {
          console.log(response);
          message.error(response?.message || "Unable to update license info");
          return;
        }

        // After successful rejection, navigate back to the ManageRequests page
        navigate("/manage-requests");
        message.success("Request Successfully Rejected");
      },
    });
  };

  return loading === false ? (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Content
        style={{
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="manage-user-request-container py-6">
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
                  <h2 className="text-2xl font-semibold mb-0">User Details</h2>
                </div>
                <Descriptions bordered>
                  <Descriptions.Item label="Username">
                    {userDetails?.uploader?.username}
                  </Descriptions.Item>
                  <Descriptions.Item label="First Name">
                    {userDetails?.uploader?.firstname}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Name">
                    {userDetails?.uploader?.lastname}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {userDetails?.uploader?.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone Number">
                    {userDetails?.uploader?.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date of Birth">
                    {userDetails?.uploader?.dob}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address" span={2}>
                    {userDetails?.uploader?.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Postal Code">
                    {userDetails?.uploader?.postal}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
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
                    Driver License Images
                  </h2>
                </div>
                <Row justify="center">
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    className="text-center"
                  >
                    <Card style={{ marginLeft: "10px", marginRight: "10px" }}>
                      <Image
                        alt="Profile"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "250px",
                          display: "inline-block",
                        }}
                        src={front ? URL.createObjectURL(front) : "/placeholder-image.jpg"}
                      />
                    </Card>
                  </Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    className="text-center"
                  >
                    <Card style={{ marginLeft: "10px", marginRight: "10px" }}>
                      <Image
                        alt="Back"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "250px",
                          display: "inline-block",
                        }}
                        src={back ? URL.createObjectURL(back) : "/placeholder-image.jpg"}
                      />
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row gutter={32} justify="center">
            <Col xs={24} sm={24} md={16}>
              <Card>
                <Row gutter={16} justify="center">
                  <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      type="primary"
                      onClick={handleApproveRequest}
                      className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                      style={{ width: "100%" }}
                    >
                      Approve Request
                    </Button>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      type="primary"
                      onClick={handleRejectRequest}
                      className="bg-red-500 hover:bg-red-600 border-red-500 confirm-button"
                      style={{ width: "100%" }}
                    >
                      Reject Request
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer className="text-center bg-gray-200 p-2">Car Rental ©2023</Footer>
    </Layout>
  ) : null;
};

export default ManageUserRequest;
