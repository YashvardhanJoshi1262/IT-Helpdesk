async function fetchRequests(){
    try {
        const response = await fetch("http://localhost:5000/api/requests");
        const requests=await response.json();
        displayRequests(requests);
    } catch(error) {
        console.error("❌ Error fetching requests:",error);
    }
}


function displayRequests(requests) {
    const tableBody=document.querySelector("#requestTable tbody");
    tableBody.innerHTML="";

    const statusFilter=document.getElementById("statusFIlter").value;

    const filteredRequests=requests.filter(req =>{
        return statusFilter === "all" || req.status ===statusFilter;
    });


    filteredRequests.forEach(req => {
    const row = `
      <tr>
        <td>${req.name}</td>
        <td>${req.email}</td>
        <td>${req.title}</td>
        <td>${req.description}</td>
        <td>${req.priority}</td>
        <td>${req.status || "Open"}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}


//reloading when changes made in filter.
document.getElementById("statusFilter").addEventListener("change",fetchRequests);


//load requests on page load.
fetchRequests();