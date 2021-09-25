import './LootBag.css';

import React, { useEffect, useRef, useState } from 'react';
import { setTimeout } from 'timers';

import { fonts } from '../fonts';
import { useCreateLootBagMutation } from '../generated/graphql';

export const TOTAL_ROWS = 8;
const MIN_INDEX = 0;
const MAX_INDEX = TOTAL_ROWS - 1;
const MAX_CHARACTERS = 45;
const URL_PREFIX = 'lootgen.party/';
const FULL_URL_PREFIX = `https://www.${URL_PREFIX}`;

export interface LootBagData {
  id: number;
  items: string[];
}

interface Props {
  itemNames?: string[];
  bagId?: number;
  locked?: boolean;
  hideShareButtons?: boolean;
  itemsOnly?: boolean;
  onLootCreate?: (lootBag: LootBagData) => void;
}

const LootBag: React.FC<Props> = ({
  itemNames = ['', '', '', '', '', '', '', ''],
  bagId,
  locked = false,
  hideShareButtons = false,
  itemsOnly = false,
  onLootCreate = () => {},
}: Props) => {
  const [items, setItems] = useState(itemNames);
  const [pasted, setPasted] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
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
      const items: string[] = data.createLootBag.items.map(
        (item) => item.item.name
      );
      onLootCreate({ id: data.createLootBag.id, items });
    }
  }, [data?.createLootBag.id, data?.createLootBag.items, onLootCreate]);

  useEffect(() => {
    if (linkCopied) {
      const timer = setTimeout(() => {
        setLinkCopied(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [linkCopied]);

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

  const createSVG = (): string => {
    const svgStrings = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" preserveAspectRatio="xMinYMin meet" viewBox="0 0 480 480">',
      `<defs><style type="text/css">${fonts}</style></defs>`,
      '<style>.base { fill: white; font-family: "EB Garamond", serif; font-size: 24px; }</style><rect width="100%" height="100%" fill="black" />',
    ];
    items.forEach((item, index) => {
      svgStrings.push(
        `<text x="24" y="${22 + (index + 1) * 38}" class="base">`
      );
      svgStrings.push(item);
      svgStrings.push('</text>');
    });
    svgStrings.push('</svg>');
    return svgStrings.join('');
  };

  return (
    <div className="loot-view">
      {itemsOnly === false && (
        <div
          className={validRows === 0 ? 'item-counter empty' : 'item-counter'}
        >
          {lootBagId === undefined
            ? `${validRows}/${MAX_INDEX + 1}`
            : `#${lootBagId}`}
        </div>
      )}
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

      {itemsOnly === false &&
        emptyRows < TOTAL_ROWS &&
        lootBagId === undefined && (
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
        <div className="share-button-container">
          {linkCopied && <div className="copied-notification">Copied!</div>}
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
                setLinkCopied(true);
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
                const blob = new Blob([createSVG()], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);

                const img = new Image();
                img.src = url;
                img.onload = () => {
                  setTimeout(() => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 1024;
                    canvas.height = 1024;
                    const context = canvas.getContext('2d');
                    document.body.appendChild(canvas);
                    if (context) {
                      context.drawImage(img, 0, 0);
                      const element = document.createElement('a');
                      element.href = canvas.toDataURL();
                      element.download = `loot-${lootBagId}.png`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                      document.body.removeChild(canvas);
                    }
                  }, 1000);
                };
              }}
            >
              Download
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LootBag;
