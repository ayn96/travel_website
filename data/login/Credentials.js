import { arrayBufferToHexString, hexStringToArrayBuffer } from "./utils.js";

export class Credentials {
  constructor(email, password) {
    console.log("Initializing Credentials...");
    this.email = email;
    this.password = password;
    console.log("Email:", this.password);
    this.salt = arrayBufferToHexString(
      window.crypto.getRandomValues(new Uint8Array(16))
    );
    this.encryptionKey = null;
    this.encryptedData = null;
    this.decryptedData = null;
  }

  async setCredentials(data) {
    console.log("Setting Credentials...");
    console.log("Encryption Key:", await this.getEncryptionKey());

    const hashRegisteredEmail = await this.findLocalStorageKeyAndSetSalt();

    if (hashRegisteredEmail) {
      console.error("User already registered");
      return;
    }

    this.encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(12),
      },
      await this.getEncryptionKey(),
      new TextEncoder().encode(JSON.stringify(data || {}))
    );

    localStorage.setItem(
      await this.getLocalStorageKey(),
      arrayBufferToHexString(this.encryptedData)
    );

    console.log(this.getCredentials());
  }

  async getCredentials() {
    console.log("Getting Credentials...");
    const localStorageKey = await this.findLocalStorageKeyAndSetSalt();

    if (!localStorageKey) {
      return;
    }

    const encryptedCredentials = localStorage.getItem(localStorageKey);

    if (!encryptedCredentials) {
      return;
    }

    console.log("Encrypted Credentials:", encryptedCredentials);
    console.log(
      "Encrypted Credentials array:",
      hexStringToArrayBuffer(encryptedCredentials)
    );

    this.decryptedData = await window.crypto.subtle
      .decrypt(
        {
          name: "AES-GCM",
          iv: new Uint8Array(12),
        },
        await this.getEncryptionKey(),
        hexStringToArrayBuffer(encryptedCredentials)
      )
      .catch((a) => {
        console.error("Invalid credentials", a);
      });

    console.log("Decrypted Data:", this.decryptedData);

    if (!this.decryptedData?.byteLength) {
      return;
    }

    try {
      console.log(
        "Decrypted Data:",
        new TextDecoder().decode(this.decryptedData)
      );
      return JSON.parse(new TextDecoder().decode(this.decryptedData));
    } catch (e) {
      console.error("Invalid credentials");
    }
  }

  async getEncryptionKey() {
    console.log("Getting Encryption Key...");
    const hash = await this.getHashedPassword();
    console.log("Hash:", hash);

    console.log(
      "Encryption Key Length:",
      new TextEncoder().encode(hash.substring(0, 16)).length * 8
    );

    return (
      this.encryptionKey ??
      (await window.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(hash.substring(0, 16)),
        "AES-GCM",
        false,
        ["encrypt", "decrypt"]
      ))
    );
  }

  async validateCredentials() {
    console.log("Validating Credentials...");
    const credentials = await this.getCredentials();
    return Boolean(credentials);
  }

  async getLocalStorageKey() {
    console.log("Getting Local Storage Key...");
    const hashEmail = await window.crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(this.salt + this.email)
    );
    return [this.salt, ":", arrayBufferToHexString(hashEmail)].join("");
  }

  async findLocalStorageKeyAndSetSalt() {
    console.log("Finding Local Storage Key...");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (!key?.includes(":")) {
        continue;
      }

      const [salt, email] = key.split(":");

      const hashEmail = await window.crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(salt + this.email)
      );

      if (email === arrayBufferToHexString(hashEmail)) {
        console.log("Local Storage Key Found...", i, salt, email);
        this.salt = salt;
        return key;
      }
    }
  }

  async getHashedPassword() {
    console.log("Getting Hashed Password...");
    const hashPassword = await window.crypto.subtle.digest(
      "SHA-512",
      new TextEncoder().encode(this.salt + this.password)
    );
    return arrayBufferToHexString(hashPassword);
  }
}
