console.log("Background running");

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "STORE_TOKEN") {
    chrome.storage.local.set({ token: message.token }, () => {
      console.log("Token saved ✅", message.token);
    });
  }
});