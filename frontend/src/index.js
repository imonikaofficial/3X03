import React from "react";
import ReactDOM from "react-dom/client";
import "./input.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// user
export { default as Home } from "./user/features/Home/Home";
export { default as Catalog } from "./user/features/Catalog/Catalog";
export { default as Booking } from "./user/features/Booking/Booking";
export { default as Checkout } from "./user/features/Checkout/Checkout";
export { default as UserProfile } from "./user/features/Profile/UserProfile";
export { default as Register } from "./user/features/Auth/Register";
export { default as Login } from "./user/features/Auth/Login";
export { default as Summary } from "./user/features/Booking/Summary";
export { default as Auth } from "./user/features/Auth/Auth";
export { default as AuthOTP } from "./user/features/Auth/AuthOTP";

//Misc
export { default as NotFound } from "./user/features/Misc/NotFound";
export { default as Success } from "./user/features/Misc/Success";
export { default as Warning } from "./user/features/Misc/Warning";
export { default as Error } from "./user/features/Misc/Error";
export { default as FAQ } from "./user/features/Misc/FAQ";


// admin
export { default as StaffManagement } from "./admin/features/StaffManagement";
export { default as CreateStaff } from "./admin/features/CreateStaff";
export { default as AdminSetup } from "./user/features/Auth/AdminSetup";
export { default as AdminResetPassword } from "./user/features/Auth/AdminResetPassword";

// staff
export { default as CarManagement } from "./staff/features/CarManagement";
export { default as CreateCar } from "./staff/features/CreateCar";
export { default as EditCar } from "./staff/features/EditCar";
export { default as ChangePassword } from "./staff/features/ChangePassword";
export { default as ManageRequests } from "./staff/features/ManageRequests";
export { default as ManageUserRequest } from "./staff/features/ManageUserRequest";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
