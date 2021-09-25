import { ApolloError } from '@apollo/client';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import LootBag, { TOTAL_ROWS } from '../components/LootBag';
import { useFetchLootBagLazyQuery } from '../generated/graphql';
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
  const isIdValid = Number.isInteger(id);
  const [fetchLootBag, { data, error }] = useFetchLootBagLazyQuery();

  useEffect(() => {
    if (isIdValid) {
      fetchLootBag({ variables: { id } });
    }
  }, [fetchLootBag, id, isIdValid])

  if (!isIdValid) {
    return <NotFoundScreen />;
  }

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
