import './LootScreen.css';

import { ApolloError } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import LootBag, { TOTAL_ROWS } from '../components/LootBag';
import { useFetchLootBagQuery } from '../generated/graphql';
import NotFoundScreen from './NotFoundScreen';

interface Props {
  itemNames?: string[];
}

const isItemNotFoundError = (error: ApolloError, id: number) => {
  const result = error.graphQLErrors.findIndex((error) => {
    if (
      error.message.startsWith(
        `Could not find any entity of type "LootBag" matching: ${id}`
      )
    ) {
      return true;
    }
    return false;
  });
  return result !== -1;
};

const LootScreen: React.FC<Props> = () => {
  const history = useHistory();
  const { id: idValue } = useParams<{ id: string }>();
  const id = parseInt(idValue);
  const { data, error } = useFetchLootBagQuery({ variables: { id } });

  let items: string[] = [];
  const bagId = id;
  if (data) {
    items = data.lootBag.items.map(({ item }) => item.name);
  } else if (error) {
    if (error.graphQLErrors.length > 0) {
      if (isItemNotFoundError(error, id)) {
        return <NotFoundScreen />;
      }
    }
  }

  return (
    <div className="container">
      <div>
        {items.length === TOTAL_ROWS && (
          <LootBag itemNames={items} bagId={bagId} />
        )}
      </div>
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

export default LootScreen;
