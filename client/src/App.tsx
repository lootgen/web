import './App.css';

import React, { createContext, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

import LootHeader from './components/LootHeader';
import AboutScreen from './screens/AboutScreen';
import CreateLootScreen from './screens/CreateLootScreen';
import LootScreen from './screens/LootScreen';
import NotFoundScreen from './screens/NotFoundScreen';

export const OverlayContext = createContext({
  showOverlay: false,
  setShowOverlay: (_show: boolean) => {},
});

function App(): JSX.Element {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="App">
      {showOverlay && <div className="overlay" />}
      <div className="container">
        <LootHeader />
        <OverlayContext.Provider value={{ showOverlay, setShowOverlay }}>
          <Switch>
            <Route exact path="/" component={CreateLootScreen} />
            <Route path="/loot/:id" component={LootScreen} />
            <Route path="/about" component={AboutScreen} />
            <Route path="*" component={NotFoundScreen} />
          </Switch>
        </OverlayContext.Provider>
      </div>
    </div>
  );
}

export default App;
