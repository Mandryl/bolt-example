const jwt = require("jsonwebtoken");
const gp = require("generate-password");
const axios = require("axios").default;

const setToken = (setting) => {
  const config = zoomConfig(setting);
  const payload = {
    iss: config.APIKey,
    exp: new Date().getTime() + 10000,
  };
  const token = jwt.sign(payload, config.APISecret);

  const instance = axios.create({
    baseURL: "https://api.zoom.us/v2",
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json",
    },
  });

  return {
    createMeeting: async () => {
      const password = gp.generate({
        length: 10,
        numbers: true,
        symbols: "@-_*",
        strict: true,
      });

      const response = await instance.post("/users/me/meetings", {
        topic: "Daily Scrum Meeting",
        type: "2",
        password: password,
        settings: {
          join_before_host: true,
        },
      });

      return {
        id: response.data.id,
        url: response.data.join_url,
      };
    },
    endMeeting: async (meetingID) => {
      return instance.put(`/meetings/${meetingID}/status`, {
        action: "end",
      });
    },
  };
};

const zoomConfig = (setting) => {
  if (setting && setting.call_api_key && setting.call_api_secret) {
    return {
      APIKey: setting.call_api_key,
      APISecret: setting.call_api_secret,
    };
  } else {
    return {
      APIKey: process.env.ZOOM_API_KEY,
      APISecret: process.env.ZOOM_API_SECRET,
    };
  }
};

module.exports = setToken;
