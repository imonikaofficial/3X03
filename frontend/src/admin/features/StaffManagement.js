import React, { useCallback, useEffect, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Table,
  Modal,
  Form,
  message,
} from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./StaffManagement.css";
import { StaffInfoGetAll, ChangePassword, StaffInfoDelete } from "../API/API";

const { Header, Content, Footer } = Layout;

const StaffManagement = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();

  const fetchStaffData = useCallback(async () => {
    const response = await StaffInfoGetAll();
    if (response.status === 200) {
      console.log(response);
      const staff = response.result.filter((item) => item.active === true);
      setData(staff);
      setLoading(false);
    } else {
      message.error(response.result ||"Unable to fetch staff data");
    }
  }, []);

  useEffect(() => {
    fetchStaffData();
  }, [fetchStaffData]);

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastName",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phoneNumber",
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleChangePassword(record.email)}
          className="bg-blue-500 hover:bg-blue-600 border-blue-500"
        >
          Change Password
        </Button>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record._id)}
          danger
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleChangePassword = (key) => {
    Modal.confirm({
      title: "Confirm Password Change",
      content:
        "Are you sure you want to send password reset to this staff account?",
      okText: "Confirm",
      okButtonProps: {
        className: "bg-red-500 hover:bg-red-600 border-red-500 confirm-button",
      },
      onOk: async () => {
        const response = await ChangePassword(key);
        console.log(response);
        if (response?.status !== 200) {
          message.error(response.result ||"Fail to send password reset email to staff account");
          return;
        }
        fetchStaffData();
        message.success("Password reset successfully sent to staff account");
      },
    });
  };

  const handleCreate = () => {
    navigate("/create-staff");
  };

  const handleDelete = (key) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this staff account?",
      okText: "Confirm",
      okButtonProps: {
        className: "bg-red-500 hover:bg-red-600 border-red-500 confirm-button",
      },
      onOk: async () => {
        const response = await StaffInfoDelete(key);
        console.log(response);
        if (response?.status !== 200) {
          message.error(response.result ||"Unable to delete staff account");
          return;
        }
        fetchStaffData();
        message.success("Staff Account Succesfully Deleted");
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
        <div className="booking-container py-6">
          <Row gutter={32} justify="center">
            <Col xs={24} sm={24} md={16}>
              <Card className="mb-4">
                {/* Content for Staff Management */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h2 className="text-2xl font-semibold mb-0">
                    Staff Management
                  </h2>
                  <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                    onClick={handleCreate}
                  >
                    Create New Staff Account
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <Table columns={columns} dataSource={data} rowKey="key" />
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

export default StaffManagement;
