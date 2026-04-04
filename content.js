console.log("Content script loaded");

function sendTokenToExtension() {
  try {
    const token = localStorage.getItem("token");

    console.log("Checking token:", token);

    if (token) {
      chrome.runtime.sendMessage({
        type: "STORE_TOKEN",
        token: token,
      });
    }
  } catch (err) {
    console.log("Error reading token", err);
  }
}

// run immediately
sendTokenToExtension();

// safer interval (increase stability)
setInterval(sendTokenToExtension, 5000);