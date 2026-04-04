const saveBtn = document.getElementById("saveBtn");
const status = document.getElementById("status");

function getToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["token"], (res) => {
      console.log("TOKEN FROM STORAGE:", res.token);
      resolve(res.token || null);
    });
  });
}

saveBtn.addEventListener("click", async () => {
  // UI Initial State
  saveBtn.disabled = true;
  saveBtn.innerHTML = 'Saving... <span class="spinner"></span>';
  status.innerText = "";
  status.className = ""; // Reset classes

  try {
    const token = await getToken();

    if (!token) {
      throw new Error("Login required in extension");
    }

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      try {
        const tab = tabs?.[0];

        if (!tab?.url) {
          throw new Error("No active tab found");
        }

        const response = await fetch(
          "https://smart-knowladge-brain-app.onrender.com/api/bookmark",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              url: tab.url,
              title: tab.title,
            }),
          },
        );

        if (!response.ok) {
          let errorMessage = "Something went wrong";

          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // agar JSON parse fail ho jaye
          }

          throw new Error(errorMessage);
        }

        // --- Success State ---
        status.innerText = "Bookmark Saved Successfully ✅";
        status.classList.add("status-success");
        saveBtn.innerText = "Done";

        // Optional: Close popup automatically after success
        setTimeout(() => window.close(), 2000);
      } catch (err) {
        // --- Inner Catch Error ---
        status.innerText = err.message;
        status.classList.add("status-error");
        saveBtn.disabled = false;
        saveBtn.innerText = "Try Again";
      }
    });
  } catch (err) {
    // --- Outer Catch Error ---
    status.innerText = err.message;
    status.classList.add("status-error");
    saveBtn.disabled = false;
    saveBtn.innerText = "Retry";
  }
});
