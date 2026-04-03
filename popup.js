const saveBtn = document.getElementById("saveBtn");
const status = document.getElementById("status");

// ✅ clean token getter
async function getToken() {
  const result = await chrome.storage.local.get("token");
  return result.token || null;
}

saveBtn.addEventListener("click", async () => {
  // UI Initial State
  saveBtn.disabled = true;
  saveBtn.innerHTML = 'Saving... <span class="spinner"></span>';
  status.innerText = "";
  status.className = "";

  try {
    const token = await getToken();

    console.log("Token in popup:", token); // 🔥 DEBUG

    if (!token) {
      throw new Error("Login required in extension");
    }

    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

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
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    // --- Success ---
    status.innerText = "Bookmark Saved Successfully ✅";
    status.classList.add("status-success");
    saveBtn.innerText = "Done";

    setTimeout(() => window.close(), 1500);
  } catch (err) {
    console.error("Error:", err);

    status.innerText = err.message;
    status.classList.add("status-error");

    saveBtn.disabled = false;
    saveBtn.innerText = "Try Again";
  }
});
