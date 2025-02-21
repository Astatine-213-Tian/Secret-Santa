import { scryptAsync } from "@noble/hashes/scrypt"
import { randomBytes } from "@noble/hashes/utils"

// Scrypt parameters
const config = {
  N: 2 ** 16,
  r: 8,
  p: 1,
  dkLen: 32,
}

async function generateKey(password: string, salt: string): Promise<string> {
  const derivedKey = await scryptAsync(password, salt, {
    N: config.N,
    r: config.r,
    p: config.p,
    dkLen: config.dkLen,
  })
  return Buffer.from(derivedKey).toString("hex")
}

/**
 * Hash a password by generating a random salt and computing the scrypt derived key.
 * @param password - The plain text password.
 * @returns A string in the format salt:hash (both hex-encoded)
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate a random salt (16 bytes)
  const saltArray = randomBytes(16)
  const salt = new TextDecoder().decode(saltArray)

  // Derive a key using scrypt
  const key = await generateKey(password, salt)
  // Store salt and hash separated by a colon
  return `${salt}:${key}`
}

/**
 * Verify a password against a stored hash.
 * @param {hash} - The stored hash password.
 * @param {password} - The plain text password.
 * @returns True if the password is valid, false otherwise.
 */
export async function verifyPassword({
  hash,
  password,
}: {
  hash: string
  password: string
}): Promise<boolean> {
  // Split the stored string to get the salt and hash
  const [salt, key] = hash.split(":")
  if (!salt || !hash) {
    throw new Error("Invalid stored password")
  }

  // Derive the key for the given password using the extracted salt
  const targetKey = await generateKey(password, salt)

  // Compare the newly derived hash with the stored hash
  return targetKey === key
}
