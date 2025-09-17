//test api code 
document.getElementById("testApiBtn").addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:5000/api/test");
    const data = await response.json();

    showToast(data.message, "success");
    console.log("✅ API Response:", data);
  } catch (error) {
    console.error("❌ API Error:", error);
    showToast("❌ API Error!", error);
  }
});


//handle form submission
document.getElementById("requestForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value;

  if (!name || !email || !title || !description || !priority) {
    showToast("⚠️ Please fill all the fields.", "error");
    return;
  }

  const requestData = { name, email, title, description, priority };

  try {
    const response = await fetch("http://localhost:5000/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();
    showToast(data.message, "success");
    console.log("✅ Request saved:", data);
    document.getElementById("requestForm").reset();

    fetchRequests(); // ✅ refresh list after new request
  } catch (error) {
    console.error("❌ Error submitting request:", error);
    showToast("❌ Error submitting request!", "error");
  }
});


//fetch and display all requests
async function fetchRequests(status = "") {
  try {
    let url = "http://localhost:5000/api/requests";
    if (status) {
      url += `?status=${encodeURIComponent(status)}`;
    }

    console.log("🔎 Fetching:", url);
    const response = await fetch(url);
    const requests = await response.json();

    const tableBody = document.querySelector("#requestsTable tbody");
    tableBody.innerHTML = "";

    if (requests.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6">No requests found</td></tr>`;
      return;
    }

    requests.forEach(req => {
      const row = `
        <tr>
          <td>${req.name}</td>
          <td>${req.email}</td>
          <td>${req.title}</td>
          <td>${req.priority}</td>
          <td>
            <select class="status-dropdown" data-id="${req._id}">
              <option value="Open" ${req.status === "Open" ? "selected" : ""}>Open</option>
              <option value="In Progress" ${req.status === "In Progress" ? "selected" : ""}>In Progress</option>
              <option value="Closed" ${req.status === "Closed" ? "selected" : ""}>Closed</option>
            </select>
          </td>
          <td>${new Date(req.createdAt).toLocaleString()}</td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });

    updateStats(requests);

    
    // ✅ Add event listeners for dropdowns
    document.querySelectorAll(".status-dropdown").forEach(dropdown => {
      dropdown.addEventListener("change", async (e) => {
        const id = e.target.getAttribute("data-id");
        const newStatus = e.target.value;

        try {
          const response = await fetch(`http://localhost:5000/api/requests/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          });

          const data = await response.json();
          console.log("✅ Status updated:", data);
          showToast("✅ Status updated successfully!", "success");

          fetchRequests(document.getElementById("statusFilter").value); // refresh list
        } catch (error) {
          console.error("❌ Error updating status:", error);
          showToast("❌ Error updating status!", "error");
        }
      });
    });


    function updateStats(requests) {
      document.getElementById("totalCount").textContent = requests.length;

      const open = requests.filter(r => r.status === "Open").length;
      const progress = requests.filter(r => r.status === "In Progress").length;
      const closed = requests.filter(r => r.status === "Closed").length;

      document.getElementById("openCount").textContent = open;
      document.getElementById("progressCount").textContent = progress;
      document.getElementById("closedCount").textContent = closed;
    }

    // Call this after fetching or updating requests
    function renderRequests(requests) {
      const tableBody = document.querySelector("#requestsTable tbody");
      tableBody.innerHTML = "";

      requests.forEach(req => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${req.title}</td>
          <td>${req.email}</td>
          <td>${req.priority}</td>
          <td>${req.status}</td>
          <td>${req.createdAt}</td>
          <td>
            <button onclick="updateStatus('${req._id}', 'In Progress')">In Progress</button>
            <button onclick="updateStatus('${req._id}', 'Closed')">Close</button>
          </td>
        `;
        tableBody.appendChild(row);
      });

      // update dashboard stats
      updateStats(requests);
    }

  } catch (error) {
    console.error("Error fetching requests:", error);
  }
}


// Run fetchRequests when filter changes
document.getElementById("statusFilter").addEventListener("change", (e) => {
  fetchRequests(e.target.value);
});


// Initial load
window.onload = () => fetchRequests();


//reset filter button
document.getElementById("resetFilter").addEventListener("click", () => {
  document.getElementById("statusFilter").value = "";
  fetchRequests();
});


// Toast Notification Function (ServiceNow style with close button)
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  // Create message span
  const msg = document.createElement("span");
  msg.textContent = message;

  // Create close button
  const closeBtn = document.createElement("span");
  closeBtn.innerHTML = "&times;";
  closeBtn.className = "close-btn";
  closeBtn.onclick = () => toast.remove();

  // Append elements
  toast.appendChild(msg);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  // Auto remove after 3 sec if not closed manually
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 3000);
}
