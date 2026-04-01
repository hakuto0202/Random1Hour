import { useState, useEffect } from 'react';
import { TaskBox } from './components/TaskBox';
import { History } from './components/History';
import { Roulette } from './components/Roulette';
import { Timer } from './components/Timer';
import { ChoiceBox } from './components/ChoiceBox';

export interface Task {
  id: string;
  text: string;
}

export interface HistoryItem {
  id: string;
  taskId?: string;
  taskText: string;
  timestamp: number;
}

export type Theme = 'default' | 'cyberpunk' | 'mint' | 'sunset' | 'ocean';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentView, setCurrentView] = useState<'main' | 'history'>('main');
  const [theme, setTheme] = useState<Theme>('default');
  
  // New States for expanded features
  const [activeMission, setActiveMission] = useState<Task | null>(null);
  const [pendingChoices, setPendingChoices] = useState<Task[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('r1h_tasks');
    const savedHistory = localStorage.getItem('r1h_history');
    const savedTheme = localStorage.getItem('r1h_theme') as Theme;
    const savedActive = localStorage.getItem('r1h_active');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedTheme) setTheme(savedTheme);
    if (savedActive) setActiveMission(JSON.parse(savedActive));
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('r1h_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('r1h_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('r1h_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (activeMission) {
      localStorage.setItem('r1h_active', JSON.stringify(activeMission));
    } else {
      localStorage.removeItem('r1h_active');
    }
  }, [activeMission]);

  // Common handler for task selection (from Roulette, ChoiceBox, or TaskBox)
  const handleSelectTask = (task: Task) => {
    const newHistoryItem: HistoryItem = {
      id: crypto.randomUUID(),
      taskId: task.id,
      taskText: task.text,
      timestamp: Date.now()
    };
    setHistory(prev => [...prev, newHistoryItem]);
    setActiveMission(task);
    setPendingChoices([]); // Clear choices after selection
  };

  const startTripleChoice = () => {
    if (tasks.length < 3) {
      alert('3択モードには少なくとも3つのタスクを登録してください');
      return;
    }
    // Randomly pick 3 unique tasks
    const shuffled = [...tasks].sort(() => 0.5 - Math.random());
    setPendingChoices(shuffled.slice(0, 3));
    setActiveMission(null);
  };

  const clearHistory = () => {
    if (window.confirm('すべての履歴を削除してもよろしいですか？')) {
      setHistory([]);
    }
  };

  const todayStr = new Date().toLocaleDateString('ja-JP');
  const todayHistory = history.filter(item => 
    new Date(item.timestamp).toLocaleDateString('ja-JP') === todayStr
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-main">
          <h1>Random 1 Hour</h1>
          <p>次の1時間を決める運命のガチャ</p>
        </div>
        <div className="theme-selector glass-panel">
          <label>Theme:</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
            <option value="default">Default Blue</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="mint">Fresh Mint</option>
            <option value="sunset">Sunset Glow</option>
            <option value="ocean">Deep Ocean</option>
          </select>
        </div>
      </header>
      
      {activeMission && (
        <section className="active-mission-banner glass-panel">
          <div className="mission-content">
            <span className="mission-label">Current Mission</span>
            <h2 className="mission-text">{activeMission.text}</h2>
          </div>
          <button className="complete-btn" onClick={() => setActiveMission(null)}>完了 / 閉じる</button>
        </section>
      )}

      <main className="app-main">
        {currentView === 'main' ? (
          <div className="main-layout">
            <div className="main-col">
              {pendingChoices.length > 0 ? (
                <ChoiceBox 
                  choices={pendingChoices} 
                  allTasks={tasks}
                  onSelect={handleSelectTask} 
                  onCancel={() => setPendingChoices([])} 
                />
              ) : (
                <Roulette 
                  tasks={tasks} 
                  onResult={handleSelectTask} 
                  onTripleChoice={startTripleChoice}
                  theme={theme} 
                />
              )}
              <TaskBox tasks={tasks} setTasks={setTasks} history={history} onSelect={handleSelectTask} />
            </div>
            <div className="main-col">
              <Timer />
              <History 
                history={todayHistory} 
                onClear={clearHistory} 
                onShowAll={() => setCurrentView('history')} 
              />
            </div>
          </div>
        ) : (
          <History 
            history={history} 
            onClear={clearHistory} 
            onBack={() => setCurrentView('main')} 
            isFullPage={true} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
