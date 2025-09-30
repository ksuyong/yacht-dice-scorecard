import React from 'react';
import DiceIcon from './DiceIcon';

const PokerIcon = ({ type, size = 'small' }) => {
  const getIcons = () => {
    switch (type) {
      case 'choice':
        return [1, 2, 3, 4, 5].map((num, idx) => (
          <DiceIcon key={idx} number={num} size={size} />
        ));
      case 'fourOfKind':
        return [6, 6, 6, 6, 1].map((num, idx) => (
          <DiceIcon key={idx} number={num} size={size} />
        ));
      case 'fullHouse':
        return [5, 5, 5, 2, 2].map((num, idx) => (
          <DiceIcon key={idx} number={num} size={size} />
        ));
      case 'smallStraight':
        return [1, 2, 3, 4].map((num, idx) => (
          <DiceIcon key={idx} number={num} size={size} />
        ));
      case 'largeStraight':
        return [2, 3, 4, 5, 6].map((num, idx) => (
          <DiceIcon key={idx} number={num} size={size} />
        ));
      case 'yacht':
        return [6, 6, 6, 6, 6].map((num, idx) => (
          <DiceIcon key={idx} number={num} size={size} />
        ));
      default:
        return null;
    }
  };

  return (
    <div className="poker-icon" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
      {getIcons()}
    </div>
  );
};

export default PokerIcon;