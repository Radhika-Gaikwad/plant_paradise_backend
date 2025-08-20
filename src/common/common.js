// common/common.js
export const sendResponse = (code, message, data = null) => {
  const response = { code, message };
  if (data) {
    response.data = data;
  }
  return response;
};

export const encrypt = (text) => {
  // You can expand this later if you need encryption
  return text;
};
