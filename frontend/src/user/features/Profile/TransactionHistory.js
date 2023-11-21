import React, { useCallback, useEffect, useState } from "react";
import { Table, Typography, message, Card, Row, Col, Layout, Breadcrumb } from "antd";
import { TransactionGetAllByUserId } from "../../API/API";
import moment from "moment";

const { Content, Footer } = Layout;

const TransactionHistory = () => {
  const [data, setData] = useState([]);

  const fetchTransactionHistory = useCallback(async () => {
    const response = await TransactionGetAllByUserId();
    if (response?.status === 200) {
      setData(response.result);
    } else {
      message.error("Error fetching transaction history");
    }
  }, []);

  useEffect(() => {
    fetchTransactionHistory();
  }, [fetchTransactionHistory]);

  const columns = [
    {
      title: "#",
      dataIndex: "_id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Start Date",
      dataIndex: "transactionStartDate",
      render: (text) => <div>{moment(text).format("YYYY-MM-DD")}</div>,
    },
    {
      title: "Return Date",
      dataIndex: "transactionEndDate",
      render: (text) => <div>{moment(text).format("YYYY-MM-DD")}</div>,
    },
    {
      title: "Total days",
      render: (data) => {
        const eDate = moment(data.transactionEndDate).format("YYYY-MM-DD");
        const sDate = moment(data.transactionStartDate).format("YYYY-MM-DD");
        return <div>{1 + moment(eDate).diff(moment(sDate), "days")}</div>;
      },
    },
    {
      title: "Paid Amount ($)",
      dataIndex: "transactionAmount",
    },
  ];

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
                    <Breadcrumb.Item>Transaction History</Breadcrumb.Item>
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
                  <h2 className="text-2xl font-semibold mb-0">Transaction History</h2>
                </div>
                <Table 
                columns={columns} 
                dataSource={data} 
                bordered
                style={{
                  paddingTop: "20px",
                  paddingBottom: "20px"
                }} />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default TransactionHistory;
