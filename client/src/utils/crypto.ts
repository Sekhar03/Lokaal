// Secure cryptographic utilities for Lokaal using the native Web Crypto API
// Implements AES-GCM 256-bit symmetric encryption/decryption

const SALT = new TextEncoder().encode('lokaal-secure-salt-key-1029');

async function getCryptoKey(passphrase: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: SALT,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts plain text to a secure Base64 cipher string using AES-GCM 256
 */
export async function encryptMessage(text: string, secret: string = 'lokaal-shared-secret'): Promise<string> {
  try {
    const enc = new TextEncoder();
    const key = await getCryptoKey(secret);
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit random IV
    
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(text)
    );
    
    // Concatenate IV + Ciphertext for easy storage/transmission
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    
    // Convert binary array to Base64
    let binary = '';
    const len = combined.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(combined[i]);
    }
    return btoa(binary);
  } catch (err) {
    console.error('Encryption failed:', err);
    throw err;
  }
}

/**
 * Decrypts a Base64 cipher string back to original plain text
 */
export async function decryptMessage(encryptedBase64: string, secret: string = 'lokaal-shared-secret'): Promise<string> {
  try {
    const dec = new TextDecoder();
    const key = await getCryptoKey(secret);
    
    // Decode Base64 to binary string
    const binary = atob(encryptedBase64);
    const len = binary.length;
    const combined = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      combined[i] = binary.charCodeAt(i);
    }
    
    // Extract IV (first 12 bytes) and ciphertext
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );
    
    return dec.decode(decryptedBuffer);
  } catch (err) {
    console.error('Decryption failed:', err);
    return '[Decryption Error: Key mismatch or tampered payload]';
  }
}
