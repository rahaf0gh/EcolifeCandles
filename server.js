const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cors = require("cors"); // استيراد مكتبة CORS
const fs = require("fs");

const app = express();
app.use(bodyParser.json());
app.use(cors()); // تمكين CORS لجميع الطلبات

// المفتاح الخاص
const privateKey = fs.readFileSync("private.key", "utf8");

app.post("/decrypt", (req, res) => {
  const { encryptedMessage } = req.body;

  try {
    console.log("Received encrypted message:", encryptedMessage);

    const decryptedMessage = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(encryptedMessage, "base64")
    );

    console.log("Decrypted message:", decryptedMessage.toString("utf8"));
    res.json({ decryptedMessage: decryptedMessage.toString("utf8") });
  } catch (error) {
    console.error("Error decrypting message:", error);
    res.status(500).json({ error: "Failed to decrypt the message." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

