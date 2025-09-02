// src/App.js
import React from 'react';
import './App.css';
import MarkdownEditor from './components/MarkdownEditor';

const App = () => {
  return (
    <div className="App">
      <main className="max-w-full mx-auto ">
        <MarkdownEditor />
      </main>
    </div>
  );
};

export default App;
