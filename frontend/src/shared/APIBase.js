// Params:

import { getCookie } from "../user/features/Auth/TokenManager";

// dictionary> key-values

export const GenerateHeader = (dictionary, form = false, image = false) => {
  if (image === true) {
    return {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    };
  }

  if (form === true) {
    return {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: dictionary,
    };
  }
  if (dictionary !== undefined) {
    // Forms POST header
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify(dictionary),
    };
  } else {
    return {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    };
  }
};

// Params:
// apiURL> api endpoint, e.g. /api/example
export const GetResponse = async (apiURL, requestOptions) => {
  let response;
  console.log(requestOptions);
  await fetch(apiURL, requestOptions)
    .then((res) => {
      // Check the Content-Type of the response
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return res.json(); // JSON response
      } else if (contentType && contentType.startsWith("image")) {
        return res.blob(); // Image response
      } else {
        // Handle other content types or errors here
        throw new Error("Unsupported content type: " + contentType);
      }
    })
    .then((data) => {
      response = data;
    })
    .catch((err) => console.log("error: ", err));

  return response;
};
