import React, { useState, useEffect, useCallback } from "react";
import { Layout, Row, Col, Card, Table, Button, Statistic, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { LicenseInfoGetAll } from "../API/API";
import moment from "moment";
const { Header, Content, Footer } = Layout;
const { Option } = Select;

const ManageRequests = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for fetching data

  const fetchLicenseData = useCallback(async () => {
    // Fetch license data from backend
    const response = await LicenseInfoGetAll();
    if (response?.status == 200) {
      setData(response.result);
      setLoading(false);
    }
  }, []);

  const [filteredData, setFilteredData] = useState(data);
  const [pendingData, setPendingData] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(null); // State to hold the selected status filter

  useEffect(() => {
    fetchLicenseData();
  }, [fetchLicenseData]);

  useEffect(() => {
    // Calculate counts when data changes
    const calculateCounts = () => {
      const pending = data.filter(
        (item) => item.isVerified === "Pending"
      ).length;
      const approved = data.filter(
        (item) => item.isVerified === "Approved"
      ).length;
      const rejected = data.filter(
        (item) => item.isVerified === "Rejected"
      ).length;
      const total = data.length;

      setPendingCount(pending);
      setApprovedCount(approved);
      setRejectedCount(rejected);
      setTotalCount(total);
    };
    if (!loading) {
      calculateCounts();
      console.log(data);
      setFilteredData(data);
    }
  }, [data]);

  useEffect(() => {
    // Separate pending requests into a new data source
    const pending = data.filter((item) => item.isVerified === "Pending");
    setPendingData(pending);
  }, [data]);

  const commonCardStyle = {
    marginBottom: "20px",
  };

  const pendingRequests = [
    {
      title: "Username",
      dataIndex: "uploader",
      key: "username",
      render: (text) => <div>{text?.username}</div>,
    },
    {
      title: "Email",
      dataIndex: "uploader",
      key: "email",
      render: (text) => <div>{text?.email}</div>,
    },
    {
      title: "Phone Number",
      dataIndex: "uploader",
      key: "phone",
      render: (text) => <div>{text?.phone}</div>,
    },
    {
      title: "Status",
      dataIndex: "isVerified",
      key: "status",
    },
    {
      title: "Date of Request",
      dataIndex: "createdAt",
      key: "dateRequested",
      render: (text) => <div>{moment(text).format("YYYY-MM-DD")}</div>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleManageUserRequest(record._id)}
            className="bg-blue-500 hover:bg-blue-600 border-blue-500"
            style={{ marginRight: "8px" }}
          >
            Manage Requests
          </Button>
        </div>
      ),
    },
  ];

  const allRequests = [
    {
      title: "Username",
      dataIndex: "uploader",
      key: "username",
      render: (text) => <div>{text?.username}</div>,
    },
    {
      title: "Email",
      dataIndex: "uploader",
      key: "email",
      render: (text) => <div>{text?.email}</div>,
    },
    {
      title: "Phone Number",
      dataIndex: "uploader",
      key: "phoneNumber",
      render: (text) => <div>{text?.phone}</div>,
    },
    {
      title: "Status",
      dataIndex: "isVerified",
      key: "status",
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Approved", value: "Approved" },
        { text: "Rejected", value: "Rejected" },
      ],
      onFilter: (value, record) =>
        value === null ? true : record.isVerified === value,
    },
    {
      title: "Date of Request",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <div>{moment(text).format("YYYY-MM-DD")}</div>,
    },
    {
      title: "Date of Approval/Rejection",
      dataIndex: "isVerified",
      key: "updatedAt",
      render: (status) =>
        !loading ? (
          <div>
            {console.log(status)}
            {status !== "Pending"
              ? moment(filteredData.updatedAt).format("YYYY-MM-DD")
              : "Pending"}
          </div>
        ) : null,
    },
  ];

  const handleManageUserRequest = (data) => {
    navigate(`/manage-user-request/${data}`);
  };

  const handleTableChange = (_, filters) => {
    const filteredStatuses = filters.isVerified || [];
    setFilteredData(
      data.filter(
        (item) =>
          filteredStatuses.includes(item.isVerified) ||
          (filteredStatuses.length === 0 && item.isVerified !== "All Requests")
      )
    );
  };

  const handleStatusFilterChange = (value) => {
    setSelectedStatus(value);
    // Apply the filter to the table data
    const filteredStatuses = value === null ? [] : [value];
    setFilteredData(
      data.filter(
        (item) =>
          filteredStatuses.includes(item.isVerified) ||
          (filteredStatuses.length === 0 && item.isVerified !== "All Requests")
      )
    );
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
        <div className="manage-requests-container py-6">
          <Row gutter={32} justify="center">
            <Col xs={24} sm={24} md={16}>
              <Card className="mb-4" style={commonCardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h2 className="text-2xl font-semibold mb-0">
                    Verification Requests
                  </h2>
                </div>
                <Row gutter={16}>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="Total"
                        value={totalCount}
                        valueStyle={{ color: "#000000" }}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="Pending"
                        value={pendingCount}
                        valueStyle={{ color: "#0050b3" }}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="Approved"
                        value={approvedCount}
                        valueStyle={{ color: "#3f8600" }}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="Rejected"
                        value={rejectedCount}
                        valueStyle={{ color: "#cf1322" }}
                      />
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>

        <Row gutter={32} justify="center">
          <Col xs={24} sm={24} md={16}>
            <Card className="mb-4" style={commonCardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h2 className="text-2xl font-semibold mb-0">
                  Pending Requests
                </h2>
              </div>
              <div className="overflow-x-auto">
                <Table
                  columns={pendingRequests}
                  dataSource={pendingData}
                  rowKey="id"
                  pagination={true}
                />
              </div>
            </Card>
          </Col>
        </Row>

        <div className="manage-requests-container py-6">
          <Row gutter={32} justify="center">
            <Col xs={24} sm={24} md={16}>
              <Card className="mb-4" style={commonCardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h2 className="text-2xl font-semibold mb-0">All Requests</h2>
                  {/* Dropdown filter for status */}
                  <Select
                    placeholder="Filter by Status"
                    style={{ width: 200 }}
                    onChange={handleStatusFilterChange}
                    value={selectedStatus}
                  >
                    <Option value={null}>All Requests</Option>
                    <Option value="Pending">Pending</Option>
                    <Option value="Approved">Approved</Option>
                    <Option value="Rejected">Rejected</Option>
                  </Select>
                </div>
                <div className="overflow-x-auto">
                  <Table
                    columns={allRequests}
                    dataSource={filteredData}
                    rowKey="id"
                    onChange={handleTableChange}
                    pagination={true}
                  />
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

export default ManageRequests;
