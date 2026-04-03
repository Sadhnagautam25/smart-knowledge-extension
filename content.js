console.log("Content script loaded");

function sendTokenToExtension() {
  const token = localStorage.getItem("token");

  if (token) {
    chrome.runtime.sendMessage({
      type: "STORE_TOKEN",
      token: token,
    });
  }
}

// run on load
sendTokenToExtension();

// also watch changes
setInterval(sendTokenToExtension, 2000);