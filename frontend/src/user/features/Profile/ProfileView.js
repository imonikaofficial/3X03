import React from "react";
import { useState } from "react";
import { Form, Typography, Modal, Button, Input, DatePicker, Select, Card, Row, Col, Layout, Breadcrumb, Descriptions } from "antd";
import { deleteSessionCookie } from "../Auth/TokenManager";
import { UserInfoUpdate } from "../../API/routes/APIUserInfo";
import DOMPurify from 'dompurify';
import moment from "moment";

const { Content, Footer } = Layout;

const ProfileView = ({ data, loading }) => {
  const [isUpdate, setIsUpdate] = useState(false);

  const logout = async () => {
    await deleteSessionCookie();
    window.location.reload();
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
                  }}
                >
                  <Breadcrumb>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Profile</Breadcrumb.Item>
                    <Breadcrumb.Item>View Profile</Breadcrumb.Item>
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
                  <h2 
                  className="text-2xl font-semibold mb-0"
                  style={{
                    paddingTop: "20px",
                    paddingBottom: "20px"
                  }}>
                    Your Profile
                  </h2>
                  <Button type="dashed" onClick={logout}>
                    Logout
                  </Button>
                </div>
                {isUpdate ? (
                  <UpdateForm data={data} setIsUpdate={setIsUpdate} />
                ) : (
                  <ViewForm data={data} setIsUpdate={setIsUpdate} loading={loading} />
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default ProfileView;

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};


const ViewForm = ({ data, setIsUpdate, loading }) => {
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : data ? (
        <Descriptions
          labelStyle={{ fontWeight: "bold" }}
          bordered
          style={{
            maxWidth: "100%", 
            paddingLeft: "10%",
            paddingRight: "10%",
            paddingBottom: "20px"
          }}
        >
          <Descriptions.Item label="Username" span={3}>{data["username"]}</Descriptions.Item>
          <Descriptions.Item label="First Name" span={3}>
            {data["firstname"]}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name" span={3}>{data["lastname"]}</Descriptions.Item>
          
          <Descriptions.Item label="Email" span={3}>
            {`${data["email"]} ${data["emailVerified"] ? "(verified)" : "(unverified)"}`}
          </Descriptions.Item>
          <Descriptions.Item label="Date of Birth" span={3}>
            {formatDate(data["dob"])}
          </Descriptions.Item>
          <Descriptions.Item label="Address" span={3}>{data["address"]}</Descriptions.Item>
          <Descriptions.Item label="Postal" span={3}>{data["postal"]}</Descriptions.Item>
          <Descriptions.Item label="Country" span={3}>{data["country"]}</Descriptions.Item>
          <Descriptions.Item label="Phone" span={3}>{data["phone"]}</Descriptions.Item>

        </Descriptions>
      ) : (
        <div>Failed to load</div>
      )}
      <div
      style={{
      display: "flex",
      justifyContent: "right",
      alignItems: "center",
      paddingRight: "10%",
      paddingBottom: "5%"
      }}
      >
      <Button type="default" onClick={() => setIsUpdate(true)}>
        Update Profile
      </Button>
      </div>
    </div>
  );
};


const UpdateForm = ({ data, setIsUpdate }) => {
  const dateFormat = "YYYY-MM-DD";
  const { Option } = Select;
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="65">+65</Option>
        <Option value="66">+66</Option>
      </Select>
    </Form.Item>
  );
  
  const checkAge = async (newDob) => {
    const newDate = new Date(newDob);
    const today = new Date();
    const age = today.getFullYear() - newDate.getFullYear();

    if (age < 18) {
      Modal.confirm({
        title: "Under 18 years of age",
        content: "Your date of birth reflects that you are under 18 years of age. You will not be allowed to make any bookings.",
        okButtonProps: {
          className: "bg-blue-500 hover:bg-blue-600 border-blue-500",
        },
        onOk: async () => {
          const response = await UserInfoUpdate(
            DOMPurify.sanitize(data["firstname"]),
            DOMPurify.sanitize(data["lastname"]),
            DOMPurify.sanitize(data["username"]),
            data["password"],
            newDob,
            DOMPurify.sanitize(data["address"]),
            data["postal"],
            DOMPurify.sanitize(data["country"]),
            data["phone"],
            true
          );

          if (response?.status === 200) {
            window.location.reload();
          } else {
            console.log(response);
          }
        },
        onCancel: () => {},
      });
    } else {
      const response = await UserInfoUpdate(
        DOMPurify.sanitize(data["firstname"]),
        DOMPurify.sanitize(data["lastname"]),
        DOMPurify.sanitize(data["username"]),
        data["password"],
        newDob,
        DOMPurify.sanitize(data["address"]),
        data["postal"],
        DOMPurify.sanitize(data["country"]),
        data["phone"],
        true
      );

      if (response?.status === 200) {
        window.location.reload();
      } else {
        console.log(response);
      }
    }
  };

  return (
    <Form
      onFinish={async (values) => {
        checkAge(values.dob);
      }}
      labelCol={{ span: 5 }}
      style={{
        maxWidth: "100%", 
        paddingLeft: "10%",
        paddingRight: "20%",
        paddingTop: "5%",
        paddingBlock: "5%",
      }}
    >
      <Form.Item name="firstname" label="First Name">
        <Input placeholder={data["firstname"]} />
      </Form.Item>

      <Form.Item name="lastname" label="Last Name">
        <Input placeholder={data["lastname"]} />
      </Form.Item>

      <Form.Item name="username" label="Username">
        <Input placeholder={data["username"]} />
      </Form.Item>
      <Form.Item name="email" label="Email">
        <Input placeholder={data["email"]} disabled={true} />
      </Form.Item>
      <Form.Item name="dob" label="Date of Birth">
        <DatePicker
          format={dateFormat}
          style={{ width: "100%" }}
          value={moment(data["dob"], dateFormat)}
        />
      </Form.Item>

      <Form.Item name="address" label="Address">
        <Input placeholder={data["address"]} />
      </Form.Item>
      <Form.Item
        name="postal"
        label="Postal Code"
        rules={[
          {
            min: 6,
            max: 6,
            message: "Postal code should be 6 digits!",
          },
        ]}
      >
        <Input type="number" defaultValue={Number(data["postal"])} />
      </Form.Item>

      <Form.Item name="country" label="Country">
        <Select placeholder={data["country"]}>
          <Option value="singapore">Singapore</Option>
          <Option value="malaysia">Malaysia</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          {
            min: 8,
            max: 8,
            message: "Phone number should be 8 digits!",
          },
        ]}
      >
        <Input
          defaultValue={Number(data["phone"])}
          addonBefore={prefixSelector}
          style={{
            width: "100%",
          }}
        />
      </Form.Item>
      <Form.Item style={{ float: "right" }}>
        <Button type="default" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};
