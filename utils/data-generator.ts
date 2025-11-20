/**
 * Data Generator Utility
 * Generates unique dynamic data for test execution
 */

/**
 * Generates a unique phone number (10 digits)
 * Combines timestamp with random number for maximum uniqueness
 */
export function generateUniquePhoneNumber(): string {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-10);
}

/**
 * Generates a unique SSN (10 digits)
 * Combines timestamp with random number for maximum uniqueness
 */
export function generateUniqueSSN(): string {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-10);
}

/**
 * Generates a unique username
 * Combines prefix with timestamp and random number
 */
export function generateUniqueUsername(prefix: string = 'q'): string {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 10000)}`;
}

/**
 * Generates a unique email address
 */
export function generateUniqueEmail(domain: string = 'test.com'): string {
  return `user${Date.now()}${Math.floor(Math.random() * 10000)}@${domain}`;
}

/**
 * Generates a random number within a range
 */
export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random string of specified length
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

