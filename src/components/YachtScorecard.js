import React, { useState } from 'react';
import './YachtScorecard.css';
import DiceIcon from './DiceIcon';
import PokerIcon from './PokerIcon';

const YachtScorecard = () => {
  const [players, setPlayers] = useState(['플레이어1', '플레이어2']);
  const [scores, setScores] = useState({});

  const categories = [
    { id: 'ace', name: '에이스', description: '1의 개수만큼', diceNumber: 1 },
    { id: 'dual', name: '듀얼', description: '2의 개수 × 2', diceNumber: 2 },
    { id: 'triple', name: '트리플', description: '3의 개수 × 3', diceNumber: 3 },
    { id: 'four', name: '쿼드', description: '4의 개수 × 4', diceNumber: 4 },
    { id: 'penta', name: '펜타', description: '5의 개수 × 5', diceNumber: 5 },
    { id: 'hexa', name: '헥사', description: '6의 개수 × 6', diceNumber: 6 }
  ];

  const bonusCategories = [
    { id: 'choice', name: '초이스', points: '', isFixed: false },
    { id: 'fourOfKind', name: '포커', points: '', isFixed: false },
    { id: 'fullHouse', name: '풀 하우스', points: '', isFixed: false },
    { id: 'smallStraight', name: '스몰 스트레이트', points: 15, isFixed: true },
    { id: 'largeStraight', name: '라지 스트레이트', points: 30, isFixed: true },
    { id: 'yacht', name: '요트', points: 50, isFixed: true }
  ];

  const addPlayer = () => {
    if (players.length < 6) {
      setPlayers([...players, `플레이어${players.length + 1}`]);
    }
  };

  const removePlayer = () => {
    if (players.length > 1) {
      const newPlayers = players.slice(0, -1);
      setPlayers(newPlayers);

      // 제거된 플레이어의 점수 데이터도 삭제
      const removedPlayerIndex = players.length - 1;
      const newScores = { ...scores };
      Object.keys(newScores).forEach(key => {
        if (key.startsWith(`${removedPlayerIndex}-`)) {
          delete newScores[key];
        }
      });
      setScores(newScores);
    }
  };

  const handlePlayerNameChange = (index, newName) => {
    const newPlayers = [...players];
    newPlayers[index] = newName || `플레이어${index + 1}`;
    setPlayers(newPlayers);
  };

  const handleScoreChange = (playerId, category, value) => {
    setScores(prev => ({
      ...prev,
      [`${playerId}-${category}`]: value === '' ? undefined : parseInt(value)
    }));
  };

  const handleFixedScoreClick = (playerId, category, points) => {
    const key = `${playerId}-${category}`;
    const currentScore = scores[key];

    if (currentScore === points) {
      // 이미 선택된 경우 취소
      setScores(prev => ({
        ...prev,
        [key]: undefined
      }));
    } else {
      // 점수 선택
      setScores(prev => ({
        ...prev,
        [key]: points
      }));
    }
  };

  const getPlayerScore = (playerId, category) => {
    return scores[`${playerId}-${category}`] || '';
  };

  const getSubtotal = (playerId) => {
    return categories.reduce((sum, cat) => {
      const score = scores[`${playerId}-${cat.id}`];
      return sum + (score || 0);
    }, 0);
  };

  const getBonus = (playerId) => {
    const subtotal = getSubtotal(playerId);
    return subtotal >= 63 ? 35 : 0;
  };

  const getUpperTotal = (playerId) => {
    return getSubtotal(playerId) + getBonus(playerId);
  };

  const getLowerTotal = (playerId) => {
    return bonusCategories.reduce((sum, cat) => {
      const score = scores[`${playerId}-${cat.id}`];
      return sum + (score || 0);
    }, 0);
  };

  const getGrandTotal = (playerId) => {
    return getUpperTotal(playerId) + getLowerTotal(playerId);
  };

  return (
    <div className="yacht-scorecard">
      <h1>요트다이스</h1>

      <div className="player-controls">
        <button
          onClick={addPlayer}
          disabled={players.length >= 6}
          className="player-btn add-btn"
        >
          플레이어 추가 (+)
        </button>
        <button
          onClick={removePlayer}
          disabled={players.length <= 1}
          className="player-btn remove-btn"
        >
          플레이어 제거 (-)
        </button>
        <span className="player-count">현재 플레이어: {players.length}명</span>
      </div>

      <table className="scorecard-table">
        <thead>
          <tr>
            <th className="category-header"></th>
            {players.map((player, index) => (
              <th key={index} className="player-header">
                <input
                  type="text"
                  value={player}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  className="player-name-input"
                  placeholder={`플레이어${index + 1}`}
                  maxLength={10}
                />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
              <td className="category-name">
                <DiceIcon number={category.diceNumber} size="small" />
                {category.name}
              </td>
              {players.map((player, index) => (
                <td key={index} className="score-cell">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={getPlayerScore(index, category.id)}
                    onChange={(e) => handleScoreChange(index, category.id, e.target.value)}
                    className="score-input"
                  />
                </td>
              ))}
            </tr>
          ))}

          <tr className="subtotal-row">
            <td className="category-name">소계</td>
            {players.map((player, index) => (
              <td key={index} className="total-cell">{getSubtotal(index)}</td>
            ))}
          </tr>

          <tr className="bonus-row">
            <td className="category-name">상단 보너스(+35점)</td>
            {players.map((player, index) => (
              <td key={index} className={`total-cell ${getBonus(index) > 0 ? "bonus-earned" : ""}`}>{getBonus(index)}</td>
            ))}
          </tr>

          <tr className="upper-total-row">
            <td className="category-name">상단 합계</td>
            {players.map((player, index) => (
              <td key={index} className="total-cell">{getUpperTotal(index)}</td>
            ))}
          </tr>

          {bonusCategories.map(category => (
            <tr key={category.id}>
              <td className="category-name">
                <PokerIcon type={category.id} size="small" />
                {category.name}
              </td>
              {players.map((player, index) => (
                <td key={index} className="score-cell">
                  {category.isFixed ? (
                    <div
                      className={`fixed-score-cell ${
                        getPlayerScore(index, category.id) === category.points ? 'selected' : ''
                      }`}
                      onClick={() => handleFixedScoreClick(index, category.id, category.points)}
                    >
                      {getPlayerScore(index, category.id) === category.points ? category.points : ''}
                    </div>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={getPlayerScore(index, category.id)}
                      onChange={(e) => handleScoreChange(index, category.id, e.target.value)}
                      className="score-input"
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}

          <tr className="lower-total-row">
            <td className="category-name">하단</td>
            {players.map((player, index) => (
              <td key={index} className="total-cell">{getLowerTotal(index)}</td>
            ))}
          </tr>

          <tr className="grand-total-row">
            <td className="category-name">합계</td>
            {players.map((player, index) => (
              <td key={index} className="grand-total-cell">{getGrandTotal(index)}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default YachtScorecard;