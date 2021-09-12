import { useHistory } from 'react-router';

import NotFoundLootBag from '../components/NotFoundLootBag';

const NotFoundScreen: React.FC = () => {
  const history = useHistory();
  return (
    <div>
      <NotFoundLootBag />
      <div className="loot-footer">
        <div
          className={'button'}
          onClick={() => {
            history.push('/');
          }}
        >
          Make your own
        </div>
      </div>
    </div>
  );
};

export default NotFoundScreen;
