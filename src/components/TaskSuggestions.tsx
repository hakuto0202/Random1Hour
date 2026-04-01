import type { HistoryItem } from '../App';
import './TaskSuggestions.css';

interface Props {
  history: HistoryItem[];
  onAdd: (text: string) => void;
}

export function TaskSuggestions({ history, onAdd }: Props) {
  // Extract unique task texts and count frequency
  const frequencyMap = history.reduce((acc, item) => {
    acc[item.taskText] = (acc[item.taskText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort by frequency and recency could be good, but let's just do top unique ones
  const uniqueTasks = Object.keys(frequencyMap)
    .sort((a, b) => frequencyMap[b] - frequencyMap[a])
    .slice(0, 10);

  if (uniqueTasks.length === 0) return null;

  return (
    <div className="suggestions-container">
      <h3 className="suggestions-title">履歴から素早く選ぶ</h3>
      <div className="suggestions-grid">
        {uniqueTasks.map((text, index) => (
          <button 
            key={index} 
            className="suggestion-chip" 
            onClick={() => onAdd(text)}
            title={`${frequencyMap[text]}回実行済み`}
          >
            <span className="plus-icon">+</span>
            <span className="suggestion-text">{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
