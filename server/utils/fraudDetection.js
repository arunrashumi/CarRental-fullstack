/**
 * Fraud & Fake Booking Detection Module
 * -------------------------------------
 * - Hybrid: Rule-based + lightweight anomaly detection
 * - Outputs: fraudScore ('low'|'medium'|'high'), isSuspicious (boolean), fraudReasons (array)
 * - Stores fraud logs for audit/research
 * - See inline comments for rule explanations
 */

import Booking from '../models/Booking.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

const FRAUD_LOG_PATH = path.resolve('fraud_logs.json');

// Helper: Append fraud log (for audit/research)
export function logFraudEvent(userId, fraudScore, isSuspicious, reasons, meta = {}) {
  const logEntry = {
    userId,
    fraudScore,
    isSuspicious,
    reasons,
    meta,
    timestamp: new Date().toISOString(),
  };
  try {
    let logs = [];
    if (fs.existsSync(FRAUD_LOG_PATH)) {
      logs = JSON.parse(fs.readFileSync(FRAUD_LOG_PATH, 'utf-8'));
    }
    logs.push(logEntry);
    fs.writeFileSync(FRAUD_LOG_PATH, JSON.stringify(logs, null, 2));
  } catch (e) {
    // Defensive: log error but do not break main flow
    console.error('Fraud log write error:', e.message);
  }
}

// Main fraud detection function
export async function getFraudScoreForUser(user) {
  let score = 0;
  let reasons = [];

  // 1. Multiple accounts from same device/IP/email pattern
  if (user.deviceId) {
    const deviceUsers = await User.countDocuments({ deviceId: user.deviceId });
    if (deviceUsers > 2) {
      score += 2;
      reasons.push('Multiple accounts from same device');
    }
  }
  if (user.lastIP) {
    const ipUsers = await User.countDocuments({ lastIP: user.lastIP });
    if (ipUsers > 3) {
      score += 2;
      reasons.push('Multiple accounts from same IP');
    }
  }
  if (user.email && /(\d{3,}|test|fake|temp)/i.test(user.email)) {
    score += 1;
    reasons.push('Suspicious email pattern');
  }

  // 2. Repeated booking cancellations in short window (e.g., >2 in 24h)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentCancels = await Booking.countDocuments({
    user: user._id,
    status: 'cancelled',
    updatedAt: { $gte: since }
  });
  if (recentCancels > 2) {
    score += 2;
    reasons.push('Multiple cancellations in 24h');
  }

  // 3. Multiple failed payment attempts (if Payment model exists)
  // Defensive: Only if Payment model is present
  // Note: Assuming Payment model exists; if not, remove this block
  try {
    const Payment = (await import('../models/Payment.js')).default;
    const failedPayments = await Payment.countDocuments({
      user: user._id,
      status: 'failed',
      createdAt: { $gte: since }
    });
    if (failedPayments > 2) {
      score += 2;
      reasons.push('Multiple failed payments');
    }
  } catch (e) {
    // Payment model not found, skip
  }

  // 4. Unusual booking frequency (e.g., >5 bookings in 24h)
  const recentBookings = await Booking.countDocuments({
    user: user._id,
    createdAt: { $gte: since }
  });
  if (recentBookings > 5) {
    score += 2;
    reasons.push('Unusual booking frequency');
  }

  // 5. Abnormal booking times (e.g., >3 bookings between 12am-5am in 7d)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const nightBookings = await Booking.countDocuments({
    user: user._id,
    createdAt: { $gte: weekAgo },
    $expr: {
      $and: [
        { $gte: [{ $hour: '$createdAt' }, 0] },
        { $lte: [{ $hour: '$createdAt' }, 5] }
      ]
    }
  });
  if (nightBookings > 3) {
    score += 1;
    reasons.push('Abnormal booking times');
  }

  // Score to risk mapping
  let fraudScore = 'low';
  if (score >= 5) fraudScore = 'high';
  else if (score >= 3) fraudScore = 'medium';

  const isSuspicious = fraudScore !== 'low';

  // Log for audit
  logFraudEvent(user._id, fraudScore, isSuspicious, reasons);

  return { fraudScore, isSuspicious, fraudReasons: reasons };
}