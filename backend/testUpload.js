const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

async function testUpload() {
  try {
    console.log("🔐 Logging in...");

    // 1. LOGIN
    const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
      email: "test@test.com",
      password: "123456",
    });

    const token = loginRes.data.token;

    console.log("✅ Token received");

    // 2. CHECK FILE EXISTS
    const filePath = "./test.jpg";

    if (!fs.existsSync(filePath)) {
      console.log("❌ audio.mp3 not found in backend folder");
      return;
    }

    // 3. CREATE FORM DATA
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));
    form.append("clientName", "John Doe");

    console.log("📤 Uploading file...");

    // 4. UPLOAD REQUEST
    const uploadRes = await axios.post(
      "http://localhost:5000/api/consultations/upload",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${token}`,
        },
        maxBodyLength: Infinity,
      }
    );

    console.log("🎉 SUCCESS RESPONSE:");
    console.log(JSON.stringify(uploadRes.data, null, 2));
  }  catch (err) {
  console.log("❌ FULL ERROR:");
  console.log("MESSAGE:", err.message);
  console.log("RESPONSE DATA:", err.response?.data);
  console.log("STATUS:", err.response?.status);
}
}

testUpload();