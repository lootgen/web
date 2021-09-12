import LootBag from './LootBag';

const NotFoundLootBag: React.FC = () => {
  const items = [
    "Hmm... that's odd",
    "We couldn't find",
    'Any loot items',
    'At that location',
    '...',
    'All is not lost',
    'Try creating your own loot',
    'By clicking the button below',
  ];
  return <LootBag itemNames={items} bagId={404} locked />;
};

export default NotFoundLootBag;
