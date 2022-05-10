import * as React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

let Greet = () => (
  <div className="App">
    <button
      onClick={() => {
        parent?.postMessage?.({ pluginMessage: 'hello' }, '*');
      }}
    >
      Say hello
    </button>
    <button
      onClick={() => {
        parent?.postMessage?.({ pluginMessage: 'close' }, '*');
      }}
    >
      Close
    </button>
  </div>
);

ReactDOM.render(<Greet />, document.getElementById('root'));
