import './CreateLootScreen.css';

import { useContext } from 'react';

import { DimBackgroundContext } from '../App';
import LootBag from '../components/LootBag';
import { lootBags } from './LootData';

const CreateLootScreen: React.FC = () => {
  const dimBackground = useContext(DimBackgroundContext);

  return (
    <div>
      <LootBag
        onLootCreate={() => {
          dimBackground();
        }}
      />

      <div className="more-lootgen">
        <p>More LootGen:</p>
        {lootBags.map((lootBag, index) => (
          <LootBag
            key={`loot-${index}`}
            itemNames={lootBag}
            locked
            hideShareButtons
            itemsOnly
          />
        ))}
      </div>
    </div>
  );
};

export default CreateLootScreen;
