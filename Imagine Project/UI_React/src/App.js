import React from 'react';
import './App.css';
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Chart from './pages/chart';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Chart} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
