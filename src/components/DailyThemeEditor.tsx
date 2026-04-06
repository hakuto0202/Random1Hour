import React, { useState } from 'react';
import type { DailyTask } from '../App';
import './DailyThemeEditor.css';

interface Props {
  dailyTasks: DailyTask[];
  onUpdate: (tasks: DailyTask[]) => void;
  onClose: () => void;
}

export function DailyThemeEditor({ dailyTasks, onUpdate, onClose }: Props) {
  const [newTask, setNewTask] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task: DailyTask = {
      id: crypto.randomUUID(),
      text: newTask.trim()
    };
    
    onUpdate([...dailyTasks, task]);
    setNewTask('');
  };

  const removeTask = (id: string) => {
    onUpdate(dailyTasks.filter(t => t.id !== id));
  };

  const addPresets = () => {
    const presets = [
      "本日500円で生活",
      "2時間に1回Noteを書く",
      "ゲーム開発集中日",
      "AntiGravity開発",
      "創作料理に挑戦",
      "デジタルデトックス",
      "1日1万歩歩く",
      "未読本を消化する"
    ];
    
    const newTasks = presets
      .filter(p => !dailyTasks.some(t => t.text === p))
      .map(p => ({ id: crypto.randomUUID(), text: p }));
      
    onUpdate([...dailyTasks, ...newTasks]);
  };

  return (
    <div className="daily-editor-overlay">
      <div className="glass-panel daily-editor-modal">
        <header className="modal-header">
          <h2>デイリーテーマ設定</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </header>
        
        <p className="modal-desc">
          1日の始まりに抽選される「今日のテーマ」のリストを管理します。
        </p>

        <form onSubmit={addTask} className="add-task-form">
          <input 
            type="text" 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="新しいテーマを入力..."
            autoFocus
          />
          <button type="submit">追加</button>
        </form>

        <div className="task-list-container">
          {dailyTasks.length === 0 ? (
            <div className="empty-state">
              <p>テーマが登録されていません</p>
              <button className="sub-btn" onClick={addPresets}>おすすめを追加</button>
            </div>
          ) : (
            <ul className="theme-list">
              {dailyTasks.map(task => (
                <li key={task.id} className="theme-item">
                  <span>{task.text}</span>
                  <button className="delete-btn" onClick={() => removeTask(task.id)}>削除</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="modal-footer">
          <button className="main-btn" onClick={onClose}>完了</button>
        </footer>
      </div>
    </div>
  );
}
