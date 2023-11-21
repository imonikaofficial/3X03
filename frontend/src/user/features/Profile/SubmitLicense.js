import React, { useState } from "react";
import {
  Button,
  Form,
  Upload,
  message,
  Card,
  Row,
  Col,
  Layout,
  Breadcrumb,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadLicense } from "../../API/API";
const { Content } = Layout;

const SubmitLicense = () => {
  const [fileFront, setFileFront] = useState(null);
  const [fileBack, setFileBack] = useState(null);
  const [fileFrontPreview, setFileFrontPreview] = useState(null);
  const [fileBackPreview, setFileBackPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);

  const handleFrontFileChange = (file) => {
    setFileFront(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFileFrontPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFileFrontPreview(null);
    }
  };

  const handleBackFileChange = (file) => {
    setFileBack(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFileBackPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFileBackPreview(null);
    }
  };

  const handleAgeVerification = (e) => {
    setAgeVerified(e.target.checked);
  };

  const handleUpload = async () => {
    console.log("uploading");
    if (!ageVerified) {
      message.warning("You must confirm your age to submit the request.");
      return;
    }

    if (isSubmitted) {
      message.warning("You have already submitted the application.");
      return;
    }

    const formData = new FormData();

    if (fileFront?.name === fileBack?.name || fileFront?.uid === fileBack?.uid) {
      message.error("Front and Back of the License Card cannot be the same.");
      return;
    }

    formData.append("files", fileFront);
    formData.append("files", fileBack);
    setUploading(true);

    const response = await UploadLicense(formData);
    console.log(response);
    if (response?.status === 200) {
      message.success("Successfully uploaded files");
      setIsSubmitted(true);
      setFileBack(null);
      setFileFront(null);
      setFileBackPreview(null);
      setFileFrontPreview(null);
      setUploading(false);
    } else {
      message.error("Failed to upload files");
      setUploading(false);
    }
  };

  const propsFront = {
    onRemove: () => {
      handleFrontFileChange(null);
    },
    beforeUpload: (file) => {
      handleFrontFileChange(file);
      return false;
    },
    maxCount: 1,
    fileFront,
  };

  const propsBack = {
    onRemove: () => {
      handleBackFileChange(null);
    },
    beforeUpload: (file) => {
      handleBackFileChange(file);
      return false;
    },
    maxCount: 1,
    fileBack,
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
              <Card className="mb-4" style={{ padding: "20px", margin: "0 20px" }}>
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
                    <Breadcrumb.Item>License Verification</Breadcrumb.Item>
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
                  <h2 className="text-2xl font-semibold mb-0">License Card Verification</h2>
                </div>
                <Form
                  name="upload_license"
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
                  onFinish={handleUpload}
                >
                  <Form.Item name="fileFront" label="Front">
                    <Upload {...propsFront}>
                      <Button icon={<UploadOutlined />}>Select Front</Button>
                    </Upload>
                    {fileFrontPreview && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          maxHeight: "200px",
                        }}
                      >
                        <img
                          src={fileFrontPreview}
                          alt="Front Preview"
                          style={{ maxWidth: "100%", maxHeight: "200px", marginTop: 10 }}
                        />
                      </div>
                    )}
                  </Form.Item>
                  <Form.Item name="fileBack" label="Back">
                    <Upload {...propsBack}>
                      <Button icon={<UploadOutlined />}>Select Back</Button>
                    </Upload>
                    {fileBackPreview && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          maxHeight: "200px",
                        }}
                      >
                        <img
                          src={fileBackPreview}
                          alt="Back Preview"
                          style={{ maxWidth: "100%", maxHeight: "200px", marginTop: 10 }}
                        />
                      </div>
                    )}
                    <Checkbox
                    checked={ageVerified}
                    onChange={handleAgeVerification}
                    style={{paddingTop: "20px"}}
                    >
                    I confirm that I am at least 18 years old and eligible to submit a verification request and make a booking.
                    </Checkbox>
                    <Button
                      type="default"
                      htmlType="submit"
                      disabled={!ageVerified || fileBack === null || fileFront === null || isSubmitted}
                      loading={uploading}
                      style={{
                        marginTop: 16,
                      }}
                    >
                      {isSubmitted ? "Verification Request Submitted." : uploading ? "Uploading" : "Upload"}
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

export default SubmitLicense;
