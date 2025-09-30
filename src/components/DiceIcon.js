import React from 'react';
import './DiceIcon.css';

const DiceIcon = ({ number, size = 'small' }) => {
  const getDots = (num) => {
    const dotPatterns = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };
    return dotPatterns[num] || [];
  };

  return (
    <div className={`dice-icon ${size}`}>
      <div className="dice-face">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(position => (
          <div
            key={position}
            className={`dot ${getDots(number).includes(position) ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default DiceIcon;