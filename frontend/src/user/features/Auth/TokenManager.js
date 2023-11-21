import { useEffect } from "react";
import { RefreshToken, UserLogout } from "../../API/API";

function TokenManager({ page }) {
  useEffect(() => {
    // Get the JWT token from the cookie
    const accessToken = getCookie("token"); // Replace 'jwt' with the actual cookie name
    if (!accessToken || accessToken === "undefined") {
      return;
    }

    const expirationTimestamp = getCookieExpiry(accessToken);
    console.log("Token expiration timestamp:", expirationTimestamp);
    const checkTokenExpiry = () => {
      // Check if the token is expired or about to expire
      // If so, initiate a token refresh.
      const expirationDate = new Date(expirationTimestamp * 1000); // Convert to milliseconds
      const currentDate = new Date();
      const timeDifference = expirationDate - currentDate;
      console.log("Token expiration time difference:", timeDifference);
      if (timeDifference <= 0) {
        // Token has expired
        console.log("Token has expired");
        initiateTokenRefresh();
      } else if (timeDifference < 300000) {
        // Token will expire in less than 5 minutes
        console.log("Token will expire in less than 5 minutes");
        initiateTokenRefresh();
      }
    };

    // Function to refresh the token
    const initiateTokenRefresh = async () => {
      // Send a token refresh request to your server
      const response = await RefreshToken();
      if (response?.status !== 200) {
        const reLoginConfirmed = window.confirm(
          "Session has expired. Would you like to log in again?"
        );
        if (reLoginConfirmed) {
          // User chose to refresh, so perform a page refresh to login
          deleteSessionCookie();
          window.location.href = "/login";
        } else {
          // User chose not to
          deleteSessionCookie();
          window.location.href = "/";
        }
        return;
      }
    };
    // Check token expiry periodically
    const tokenCheckInterval = setInterval(checkTokenExpiry, 30000); // Check every half minute

    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, [page]);
}

// Function to get a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Function to get the expiration timestamp from a JWT
function getCookieExpiry(token) {
  if (token) {
    // Decode the token (assuming it's a JWT)
    const tokenParts = token.split(".");
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1])); // Decode the base64-encoded payload
      // console.log(payload);
      const expirationTimestamp = payload.exp;

      if (expirationTimestamp) {
        // The expiration timestamp is in seconds since the Unix epoch
        const expirationDate = new Date(expirationTimestamp * 1000); // Convert to milliseconds
        console.log("Token expiration date:", expirationDate);
        return expirationTimestamp;
      }
    }
  }
  return null;
}

function getId(token) {
  if (token) {
    // Decode the token (assuming it's a JWT)
    const tokenParts = token.split(".");
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1])); // Decode the base64-encoded payload
      const id = payload.UserInfo.id;
      if (id) {
        return id;
      }
    }
  }
  return null;
}

function getRole(tokenName) {
  const accessToken = getCookie(tokenName);
  if (accessToken) {
    // Decode the token (assuming it's a JWT)
    const tokenParts = accessToken.split(".");
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1])); // Decode the base64-encoded payload
      const role = payload.UserInfo.roles[0];
      if (role) {
        return role;
      }
    }
  }
  return null;
}

async function deleteSessionCookie() {
  const response = await UserLogout();
  if (response?.status === 200) {
    console.log(response);
  } else {
    console.log(response);
  }
}

export { TokenManager, deleteSessionCookie, getCookie, getRole, getId };
