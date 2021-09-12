import { useContext } from 'react';

import { DimBackgroundContext } from '../App';
import LootBag from '../components/LootBag';

const CreateLootScreen: React.FC = () => {
  const dimBackground = useContext(DimBackgroundContext);

  return (
    <div>
      <LootBag
        onLootCreate={() => {
          dimBackground();
        }}
      />
    </div>
  );
};

export default CreateLootScreen;
