import './App.css';

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import LootBag from './components/LootBag';
import LootScreen from './screens/LootScreen';
import NotFoundScreen from './screens/NotFoundScreen';

function App(): JSX.Element {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={LootBag} />
        <Route path="/loot/:id" component={LootScreen} />
        <Route path="*" component={NotFoundScreen} />
      </Switch>
    </div>
  );
}

export default App;
