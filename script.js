// المفتاح العام كنص (ضع مفتاحك العام هنا)
const publicKeyString = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy2Qu68HnnATlC11BbLdF
cd0+XXUN3NRb4aaUmZxgJAitw/O0VrJuPC0OFanWGuEs9e2vPOoFunaZPgj9EjOW
H0woJ63d+HjUXNcYz7a2m/pXV9udhYTbP0ODuZx6OEu6G3g+JoQJiBpEfQQPVHls
Y1+hhTiOjVjoNZbsbQXRx1/Brlvn+940p+mszr/b4uuNmdxT5ayfIFPc7BBq2dkB
TKFktLHNvmDSix8/MMWyDnrGT3B+LYfjzNzD3QLZcZ9+/DN2ACT0yzU9Mq4SfwXP
XZdmAhBuFnD3FSSaFL8RjL58ZvrBtqYWLoZXCTxS+swX0/flLwjdjggtEAef8Way
LwIDAQAB
-----END PUBLIC KEY-----`;

const backendURL = "https://ecolife-candles.vercel.app/decrypt";

// تحويل المفتاح العام النصي إلى CryptoKey
async function importPublicKey(pem) {
  // إزالة رؤوس المفتاح
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pem
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\n/g, "");

  const binaryDer = Uint8Array.from(atob(pemContents), (char) =>
    char.charCodeAt(0)
  );

  return window.crypto.subtle.importKey(
    "spki",
    binaryDer.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

// تشفير الرسالة
async function encryptMessage(message, publicKey) {
  const encodedMessage = new TextEncoder().encode(message);
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    encodedMessage
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

// عناصر DOM
const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const messageInput = document.getElementById("message");
const encryptedMessageArea = document.getElementById("encryptedMessage");
const decryptedMessageArea = document.getElementById("decryptedMessage");

// التعامل مع زر التشفير
encryptBtn.addEventListener("click", async () => {
  const message = messageInput.value;

  if (!message) {
    alert("Please enter a message to encrypt.");
    return;
  }

  try {
    const publicKey = await importPublicKey(publicKeyString); // استيراد المفتاح العام
    const encryptedMessage = await encryptMessage(message, publicKey);
    encryptedMessageArea.value = encryptedMessage;
  } catch (error) {
    console.error("Error encrypting message:", error);
    alert("An error occurred while encrypting the message.");
  }
});
// فك التشفير
decryptBtn.addEventListener("click", async () => {
  const encryptedMessage = encryptedMessageArea.value.trim();

  if (!encryptedMessage) {
    alert("Please enter an encrypted message.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/decrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ encryptedMessage }),
    });

    if (!response.ok) {
      throw new Error("Failed to decrypt the message.");
    }

    const data = await response.json();
    decryptedMessageArea.value = data.decryptedMessage; // عرض النص المفكوك
  } catch (error) {
    console.error("Error during decryption:", error);
    alert("An error occurred while decrypting the message.");
  }
});

  