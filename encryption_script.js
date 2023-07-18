// Function to encrypt the message
async function encryptMessage() {
  try {
    const message = document.getElementById('inputText').value;

    // Generate a cryptographic key for encryption
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );

    // Convert the message to an ArrayBuffer
    const encoder = new TextEncoder();
    const messageBuffer = encoder.encode(message);

    // Encrypt the message using the generated key
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      messageBuffer
    );

    // Combine the IV and ciphertext for storage and transmission
    const encryptedMessage = new Uint8Array(iv.byteLength + ciphertext.byteLength);
    encryptedMessage.set(iv, 0);
    encryptedMessage.set(new Uint8Array(ciphertext), iv.byteLength);

    // Convert the encrypted message to a base64 string for display
    const base64EncryptedMessage = btoa(String.fromCharCode(...encryptedMessage));
    document.getElementById('outputText').value = base64EncryptedMessage;
  } catch (error) {
    console.error('Encryption error:', error);
  }
}

// Function to decrypt the message
async function decryptMessage() {
  try {
    const encryptedMessage = document.getElementById('outputText').value;

    // Convert the base64 string back to an ArrayBuffer
    const encryptedMessageBytes = Uint8Array.from(atob(encryptedMessage), c => c.charCodeAt(0));

    // Extract the IV and ciphertext from the combined array
    const iv = encryptedMessageBytes.slice(0, 12);
    const ciphertext = encryptedMessageBytes.slice(12);

    // Generate a cryptographic key for decryption
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );

    // Decrypt the message using the generated key and IV
    const decryptedMessageBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      ciphertext
    );

    // Convert the decrypted message ArrayBuffer to a readable string
    const decoder = new TextDecoder();
    const decryptedMessage = decoder.decode(decryptedMessageBuffer);

    document.getElementById('inputText').value = decryptedMessage;
  } catch (error) {
    console.error('Decryption error:', error);
  }
}
