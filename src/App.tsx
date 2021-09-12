import './App.css';

import React, { createContext, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

import LootHeader from './components/LootHeader';
import CreateLootScreen from './screens/CreateLootScreen';
import LootScreen from './screens/LootScreen';
import NotFoundScreen from './screens/NotFoundScreen';

export const DimBackgroundContext = createContext(() => {});

function App(): JSX.Element {
  const [dimBackground, setDimBackground] = useState(false);

  return (
    <div className="App">
      {dimBackground && <div className="overlay" />}
      <div className="container">
        <LootHeader />
        <DimBackgroundContext.Provider
          value={() => {
            setDimBackground(true);
          }}
        >
          <Switch>
            <Route exact path="/" component={CreateLootScreen} />
            <Route path="/loot/:id" component={LootScreen} />
            <Route path="*" component={NotFoundScreen} />
          </Switch>
        </DimBackgroundContext.Provider>
      </div>
    </div>
  );
}

export default App;
