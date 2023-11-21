import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  HomeOutlined,
  CarOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

import {
  Home,
  Catalog,
  Booking,
  Checkout,
  UserProfile,
  NotFound,
  Register,
  Login,
  Summary,
  StaffManagement,
  ChangePassword,
  CreateStaff,
  CarManagement,
  CreateCar,
  EditCar,
  Auth,
  AuthOTP,
  ManageRequests,
  ManageUserRequest,
  Success,
  Warning,
  Error,
  AdminRegister,
  AdminSetup,
  AdminResetPassword,
  FAQ,
} from "./index";
import {
  TokenManager,
  getCookie,
  getId,
  getRole,
} from "./user/features/Auth/TokenManager";
import { UserLogout } from "./user/API/API";

const items = {
  user: [
    {
      label: "Home",
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: "Cars",
      key: "cars ",
      icon: <CarOutlined />,
    },
    {
      label: "FAQ",
      key: "faq",
      icon: <QuestionCircleOutlined />,
    },
    {
      label: "Profile",
      key:
        sessionStorage.getItem("uid") === null
          ? `profile`
          : `profile/${sessionStorage.getItem("uid")}`,
      icon: <UserOutlined />,
    },
    {
      label: "Register",
      key: "register",
    },
    {
      label: "Login",
      key: "login",
    },
  ],
  staff: [
    {
      label: "Home",
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: "Car Management",
      key: "car-management",
      icon: <CarOutlined />,
    },
    ,
    {
      label: "Manage Requests",
      key: "manage-requests",
      icon: <UserOutlined />,
    },
    {
      label: "Profile",
      key:
        sessionStorage.getItem("uid") === null
          ? `profile`
          : `profile/${sessionStorage.getItem("uid")}`,
      icon: <UserOutlined />,
    },
  ],
  admin: [
    {
      label: "Home",
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: "Staff Management",
      key: "staff-management",
      icon: <UserOutlined />,
    },
    {
      label: "Profile",
      key: "profile",
      icon: <UserOutlined />,
    },
  ],
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </div>
  );
}

function Root() {
  const location = useLocation();
  const navigate = useNavigate();

  const [current, setCurrent] = useState(location.pathname);
  const [role, setRole] = useState(getRole("token") || "user"); // get role from token null / "user" / "staff" / "admin"
  const [loading, setLoading] = useState(true);
  const [isSetup, setIsSetup] = useState(false);

  const fetchSetup = async () => {
    const response = await fetch("/api/users/get-number");
    const data = await response.json();
    console.log("Number of users", data.result);
    if (data?.result < 1) {
      const deleteResponse = await UserLogout();
      console.log("deleteResponse", deleteResponse);
      if(deleteResponse.status !== 200) {
        console.log("No cookies found")
      }
      navigate("/admin-setup");
      return
    }
    setIsSetup(true);
  };

  useEffect(() => {
    fetchSetup();
    setCurrent(location.pathname);
    setRole(getRole("token") || "user");
    setLoading(false);
    console.log("role", role);
  }, [location.pathname]);

  const shouldNotDisplayNavbar = () => {
    return (
      !current.startsWith("/auth-otp/") && !current.startsWith("/admin-setup") && !current.startsWith("/admin-reset-password")
    );
  };

  const navbar = shouldNotDisplayNavbar();

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
    navigate(e.key);
  };
  const token = getCookie("token");
  console.log("token", getId(token));
  return (
    <div>
      {loading === false && navbar && (
        <nav style={{ display: "inline-block" }}>
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items[role].filter((item) => {
              if (token) {
                return item.key !== "register" && item.key !== "login";
              } else {
                return item.key !== `profile`;
              }
            })}
          />
        </nav>
      )}

      <Routes>
        {/* user */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/cars"
          element={role === "user" ? <Catalog /> : <Home />}
        />
        <Route
          path="/booking"
          element={token && role === "user" ? <Booking /> : <Home />}
        />
        <Route
          path="/summary"
          element={token && role === "user" ? <Summary /> : <Home />}
        />
        <Route
          path="/checkout"
          element={token && role === "user" ? <Checkout /> : <Home />}
        />

        <Route
          path="/profile"
          element={
            token ? (
              role === "user" ? (
                <UserProfile />
              ) : role === "staff" ? (
                <ChangePassword />
              ) : role === "admin" ? (
                <ChangePassword />
              ) : (
                <Home />
              )
            ) : (
              <Home />
            )
          }
        />
        <Route path="/register" element={token ? <Home /> : <Register />} />
        <Route path="/login" element={token ? <Home /> : <Login />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth-otp/:id" element={<AuthOTP />} />
        <Route path="/admin-setup" element={isSetup? <Home/>:<AdminSetup />} />
        <Route path="/admin-reset-password" element={<AdminResetPassword />} />

        {/* admin */}
        <Route
          path="/staff-management"
          element={token && role === "admin" ? <StaffManagement /> : <Home />}
        />
        <Route
          path="/create-staff"
          element={token && role === "admin" ? <CreateStaff /> : <Home />}
        />

        {/* staff */}
        <Route
          path="/car-management"
          element={token && role === "staff" ? <CarManagement /> : <Home />}
        />
        <Route
          path="/create-car"
          element={token && role === "staff" ? <CreateCar /> : <Home />}
        />
        <Route
          path="/edit-car/:id"
          element={token && role === "staff" ? <EditCar /> : <Home />}
        />
        <Route path="/change-password/:id" element={<ChangePassword />} />
        <Route
          path="/manage-requests"
          element={token && role === "staff" ? <ManageRequests /> : <Home />}
        />
        <Route
          path="/manage-user-request/:id"
          element={token && role === "staff" ? <ManageUserRequest /> : <Home />}
        />

        {/* If any route mismatches the upper route endpoints */}
        <Route path="*" element={<NotFound />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/success" element={<Success />} />
        <Route path="/warning" element={<Warning />} />
        <Route path="/error" element={<Error />} />

        <Route path="/about" element={<h1>About</h1>} />
      </Routes>
      <TokenManager page={current} />
    </div>
  );
}

export default App;
