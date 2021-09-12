import './App.css';

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import LootBag from './components/LootBag';
import LootHeader from './components/LootHeader';
import LootScreen from './screens/LootScreen';
import NotFoundScreen from './screens/NotFoundScreen';

function App(): JSX.Element {
  return (
    <div className="App">
      <div className="container">
        <LootHeader />
        <Switch>
          <Route exact path="/" component={LootBag} />
          <Route path="/loot/:id" component={LootScreen} />
          <Route path="*" component={NotFoundScreen} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
