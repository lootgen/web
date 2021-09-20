import LootBag from '../components/LootBag';

const AboutScreen: React.FC = () => {
  return (
    <div className="container">
      <div>
        <LootBag
          itemNames={[
            'A few friends wanted to make memes',
            'In loot form',
            'So we built LootGen',
            'For adventurers or memelords',
            'Download and share your own loot bags',
            'Don’t let your memes be dreams',
            'Beware though, they’re not stored on-chain',
            'Yet',
          ]}
          bagId={0}
          hideShareButtons
          locked
        />
      </div>
    </div>
  );
};

export default AboutScreen;
