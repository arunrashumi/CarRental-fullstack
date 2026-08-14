// FraudBadge.jsx
// Shows fraud risk badge with tooltip (using title attribute for simplicity)
import React from 'react';

const badgeColors = {
  low: 'bg-green-100 text-green-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700'
};

export default function FraudBadge({ fraudScore, reasons }) {
  if (!fraudScore) return null;
  const tooltip = reasons && reasons.length ? reasons.join(', ') : 'No fraud detected';
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold ${badgeColors[fraudScore]}`}
      title={tooltip}
    >
      {fraudScore === 'low' ? '✔' : fraudScore === 'medium' ? '⚠' : '⛔'} {fraudScore.toUpperCase()}
    </span>
  );
}