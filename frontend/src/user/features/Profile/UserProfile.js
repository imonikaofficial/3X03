/*
To include following features:
1. User Profile
2. User Profile Update
3. User Profile Delete
4. Profile picture upload
5. Payment Method with card validation
6. Verify Driver License 
*/

import { useState, useEffect, useCallback } from "react";
import React from "react";
import { LaptopOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, Modal, theme } from "antd";
import TransactionHistory from "./TransactionHistory";
import ProfileView from "./ProfileView";
import PasswordChange from "./PasswordChange";
import { UserInfoGetOne } from "../../API/routes/APIUserInfo";
import { getCookie } from "../Auth/TokenManager";
import SubmitLicense from "./SubmitLicense";
import "./UserProfile.css";

const { Content, Sider, Footer } = Layout;

const UserProfile = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [selected, setSelected] = useState(0);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const hasSubmittedLicense = false; // Set this to true if the user has submitted a license request

  const fetchUserData = useCallback(async () => {
    const response = await UserInfoGetOne();
    if (response?.status === 200) {
      setData(response.result);
      setLoading(false);
      console.log(response.result);
    } else {
      console.log(response);
    }
  }, []);

  useEffect(() => {
    fetchUserData();

    // Display a notification when the page loads
    const showLicenseNotification = () => {
      Modal.info({
        title: "License Verification Reminder",
        content: (
          <div>
            <p>You need to verify your license before you can book a car. Submit a license verification request under "Upload License" on the side menu.</p>
          </div>
        ),
        okButtonProps: {
          className: "bg-blue-500 hover:bg-blue-600 border-blue-500",
        },
        onOk() {
          // Handle the OK button click if needed
        },
      });
    };

    // Show the notification only if the user has not submitted a license
    if (!hasSubmittedLicense) {
      showLicenseNotification();
    }
  }, [hasSubmittedLicense]);

  const items2 = [
    {
      icon: UserOutlined,
      label: "User Profile",
      page: <ProfileView data={data} loading={loading} />,
    },
    {
      icon: LaptopOutlined,
      label: "Transaction",
      page: <TransactionHistory />,
    },
    {
      icon: UserOutlined,
      label: "Upload License",
      page: <SubmitLicense />,
    },
    { icon: UserOutlined, label: "Change Password", page: <PasswordChange /> },
  ].map((item, index) => {
    return {
      key: index,
      icon: React.createElement(item.icon),
      label: item.label,
      page: item.page,
    };
  });
  return (
    <Layout>
      <Layout className="user-profile-layout">
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            onClick={(e) => {
              setSelected(e.key);
            }}
            mode="inline"
            defaultSelectedKeys={["0"]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
            items={items2}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
            minHeight: "1000px"
          }}
        >
          <Content
            style={{
              padding: 24,
              margin: 0,
              height: "100vh",
            }}
          >
            <div className="page-container">
              {items2[selected].page}
            </div>
          </Content>
        </Layout>
      </Layout>
      <Footer className="text-center bg-gray-200 p-2">Car Rental ©2023</Footer>
    </Layout>
  );
};
export default UserProfile;
