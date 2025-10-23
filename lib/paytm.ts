/**
 * Payment utilities (stub functions)
 * Note: We use Instamojo/UPI for payments, not Razorpay/Paytm
 * These are kept for compatibility with old callback routes
 */

/**
 * Verify Paytm checksum (stub - not used, we use Instamojo/UPI)
 */
export function verifyChecksum(params: any, checksum: string, key: string): boolean {
  // Stub function - not used in production
  console.warn('⚠️ verifyChecksum called but not implemented (using Instamojo/UPI)')
  return true
}
