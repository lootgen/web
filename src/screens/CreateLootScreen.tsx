import './CreateLootScreen.css';

import { useContext, useState } from 'react';

import { OverlayContext } from '../App';
import LootBag, { LootBagData } from '../components/LootBag';
import { lootBags } from './LootData';

const CreateLootScreen: React.FC = () => {
  const context = useContext(OverlayContext);
  const [pendingLootBag, setPendingLootBag] = useState<LootBagData>();
  const [createdLootBags, setCreatedLootBags] = useState<LootBagData[]>([]);
  const [createdCount, setCreatedCount] = useState(0);

  return (
    <div>
      <LootBag
        key={`new-loot-${createdCount}`}
        onLootCreate={(lootBag) => {
          setPendingLootBag(lootBag);
          context.setShowOverlay(true);
        }}
      />

      {pendingLootBag !== undefined && (
        <div className="loot-footer">
          <div
            className="make-more-button button"
            onClick={() => {
              if (
                createdLootBags.find(
                  (lootBag) => lootBag.id === pendingLootBag.id
                ) === undefined
              ) {
                setCreatedLootBags([pendingLootBag, ...createdLootBags]);
              }
              setPendingLootBag(undefined);
              setCreatedCount(createdCount + 1);
              context.setShowOverlay(false);
            }}
          >
            {'Make more'}
          </div>
        </div>
      )}

      <div className="more-lootgen">
        {createdLootBags.map((lootBag) => (
          <LootBag
            key={`created-loot-${lootBag.id}`}
            bagId={lootBag.id}
            itemNames={lootBag.items}
            locked
            hideShareButtons
          />
        ))}

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
