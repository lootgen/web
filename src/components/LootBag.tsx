import './LootBag.css';

import React, { useEffect, useRef, useState } from 'react';

import { useCreateLootBagMutation } from '../generated/graphql';
import { REST_API_URL } from '..';

export const TOTAL_ROWS = 8;
const MIN_INDEX = 0;
const MAX_INDEX = TOTAL_ROWS - 1;
const MAX_CHARACTERS = 45;
const URL_PREFIX = 'lootgen.party/';
const FULL_URL_PREFIX = `https://www.${URL_PREFIX}`;

interface Props {
  itemNames?: string[];
  bagId?: number;
  locked?: boolean;
  hideShareButtons?: boolean;
  onLootCreate?: () => void;
}

const LootBag: React.FC<Props> = ({
  itemNames = ['', '', '', '', '', '', '', ''],
  bagId,
  locked = false,
  hideShareButtons = false,
  onLootCreate = () => {},
}: Props) => {
  const [items, setItems] = useState(itemNames);
  const [pasted, setPasted] = useState(false);
  const firstEmptyIndex = items.findIndex((value) => value.length === 0);
  const hasEmptyItem = firstEmptyIndex !== -1;
  const inputRefs = useRef<Array<HTMLInputElement>>([]);
  const emptyRows = items.reduce((total, item) => {
    return item.length === 0 ? total + 1 : total;
  }, 0);
  const validRows = TOTAL_ROWS - emptyRows;

  useEffect(() => {
    if (pasted) {
      if (hasEmptyItem) {
        inputRefs.current[firstEmptyIndex].focus();
      }
      setPasted(false);
    }
  }, [firstEmptyIndex, hasEmptyItem, pasted]);

  const [createLootBag, { data, loading }] = useCreateLootBagMutation();

  useEffect(() => {
    if (data?.createLootBag.id) {
      onLootCreate();
    }
  }, [data?.createLootBag.id]);

  const lootBagId = data?.createLootBag.id ?? bagId;
  const lockInputs = locked || lootBagId;

  const showShareButtons = !hideShareButtons && lootBagId !== undefined;

  const getShareURL = (fullUrl = false) => {
    return `${fullUrl ? FULL_URL_PREFIX : URL_PREFIX}loot/${lootBagId}`;
  };

  const getTwitterShareURL = () => {
    const shareURL = encodeURIComponent(getShareURL(true));
    const title = encodeURIComponent('Generated #loot');
    const twitterAccount = 'loot_gen';
    return `https://twitter.com/intent/tweet?url=${shareURL}&text=${title}&via=${twitterAccount}`;
  };

  return (
    <div className="loot-view">
      <div className={validRows === 0 ? 'item-counter empty' : 'item-counter'}>
        {lootBagId === undefined
          ? `${validRows}/${MAX_INDEX + 1}`
          : `#${lootBagId}`}
      </div>
      <div className="loot-items">
        {items.map((item, index) => (
          <input
            className={lockInputs ? 'disabled' : ''}
            key={`loot-item-${index}`}
            maxLength={MAX_CHARACTERS}
            spellCheck={false}
            autoCapitalize="on"
            ref={(ref) => {
              if (ref) {
                inputRefs.current[index] = ref;
              }
            }}
            value={item}
            placeholder={index === firstEmptyIndex ? 'Add Loot...' : ''}
            onKeyDown={({ key }) => {
              if (key === 'ArrowDown' || key.includes('Enter')) {
                if (items[index].length > 0 && index < MAX_INDEX) {
                  inputRefs.current[index + 1].focus();
                }
              }
              if (key === 'ArrowUp') {
                if (index > MIN_INDEX) {
                  inputRefs.current[index - 1].focus();
                }
              }
            }}
            onFocus={() => {
              if (lockInputs) {
                inputRefs.current[index].blur();
                return;
              }

              if (hasEmptyItem && index > firstEmptyIndex) {
                inputRefs.current[firstEmptyIndex].focus();
              }
            }}
            onChange={({ target }) => {
              if (
                items[index].length === 0 &&
                target.value.trim().length === 0
              ) {
                return;
              }
              const newItems = [...items];
              newItems[index] = target.value;
              setItems(newItems);
            }}
            onBlur={({ target }) => {
              const newItems = [...items];
              newItems[index] = target.value.trim();
              setItems(newItems);
            }}
            onPaste={(event) => {
              const clipboardItems = event.clipboardData
                .getData('text')
                .split('\n')
                .map((item) => item.trim())
                .filter((item) => item.length > 0);
              if (clipboardItems.length > 0) {
                const newItems = [...items];
                newItems.splice(
                  index,
                  clipboardItems.length,
                  ...clipboardItems
                );
                setItems(newItems.slice(0, TOTAL_ROWS));
                setPasted(true);
              }
              event.preventDefault();
            }}
          />
        ))}
      </div>

      {emptyRows < TOTAL_ROWS && lootBagId === undefined && (
        <div
          className={
            hasEmptyItem || loading
              ? 'submit-button button disabled'
              : 'submit-button button'
          }
          onClick={() => {
            if (hasEmptyItem) {
              return;
            }
            createLootBag({ variables: { items } });
          }}
        >
          Generate
        </div>
      )}

      {showShareButtons && (
        <div className="share-buttons">
          <div
            className="button share-button"
            onClick={() => {
              const textArea = document.createElement('textarea');
              textArea.style.opacity = '0';
              textArea.value = getShareURL(true);
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand('copy');
              document.body.removeChild(textArea);
            }}
          >
            {getShareURL()}
          </div>
          <div
            className="button tweet-button"
            onClick={() => {
              window.open(getTwitterShareURL());
            }}
          >
            Tweet
          </div>
          <div
            className="button download-button"
            onClick={async () => {
              const element = document.createElement('a');
              const response = await fetch(
                `${REST_API_URL}/loot/${lootBagId}/image.png`
              );
              const data = await response.blob();
              element.href = URL.createObjectURL(data);
              element.download = `loot-${lootBagId}.png`;
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
          >
            Download
          </div>
        </div>
      )}
    </div>
  );
};

export default LootBag;
