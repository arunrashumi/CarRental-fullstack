// Fraud controller for admin dashboard
import User from '../models/User.js';
import { getFraudScoreForUser } from '../utils/fraudDetection.js';

// GET /api/owner/fraud-scores
export const getAllUserFraudScores = async (req, res) => {
  try {
    const users = await User.find({});
    const results = [];
    for (const user of users) {
      const fraud = await getFraudScoreForUser(user);
      results.push({
        userId: user._id,
        name: user.name,
        email: user.email,
        fraudScore: fraud.fraudScore,
        isSuspicious: fraud.isSuspicious,
        fraudReasons: fraud.fraudReasons
      });
    }
    res.json({ success: true, users: results });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};