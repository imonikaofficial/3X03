import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Auth = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const error = queryParams.get("error") || "";
  const message = queryParams.get("message") || "";
  useEffect(() => {
    if (!error && !message) {
      window.location.href = "/";
    }
  }, [error, message]);

  return error === true ? (
    <>
      <h2>{message}</h2>
    </>
  ) : (
    <>
      <h2>{message}</h2>
    </>
  );
};

export default Auth;
