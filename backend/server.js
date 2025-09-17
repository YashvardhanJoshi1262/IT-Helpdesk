const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const app=express();
const PORT=5000;



//middleware
app.use(cors());
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/it_helpdesk",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>console.log("✅ MongoDB connected"))
.catch(err=>console.log("❌ MongoDB error:",err));



//Test API
app.get("/api/test",(req,res)=>{
    res.json({message:"IT Helpdesk API is working 🚀 !"});
});

app.listen(PORT,()=>{
    console.log(`✅ Server running on http://localhost:${PORT}`);
})
const Request = require("./models/Request");



//create a new request
app.post("/api/requests",async(req,res)=>{
    try{
        const request=new Request(req.body);
        await request.save();
        res.status(201).json({message:"Request submitted successfully"});
    }catch(error){
        res.status(500).json({message:"Error submitting request"});
    }
});



//Get All requests
app.get("/api/requests", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status; // example: /api/requests?status=Open
    }

    const requests = await Request.find(filter).sort({ createdAt: -1 }); // use filter here
    res.json(requests);
  } catch (error) {
    console.error("❌ Error fetching requests:", error);
    res.status(500).json({ message: "Error fetching requests" });
  }
});



// Update request status
app.put("/api/requests/:id", async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ Validate status
    if (!["Open", "In Progress", "Closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Status updated successfully", request: updatedRequest });
  } catch (error) {
    console.error("❌ Error updating request:", error);
    res.status(500).json({ message: "Error updating request" });
  }
});
