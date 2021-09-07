import './LootBag.css';

import React, { useEffect, useRef, useState } from 'react';

const TOTAL_ROWS = 8;
const MIN_INDEX = 0;
const MAX_INDEX = TOTAL_ROWS - 1;
const MAX_CHARACTERS = 45;

interface Props {
  itemNames?: string[];
}

const LootBag: React.FC<Props> = ({itemNames = ["", "", "", "", "", "", "", ""]}: Props) => {
  const [items, setItems] = useState(itemNames);
  const [pasted, setPasted] = useState(false);
  const firstEmptyIndex = items.findIndex((value, index) => value.length === 0);
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

  return (
    <div className="loot-view">
        <div
          className={validRows === 0 ? "item-counter empty" : "item-counter"}
        >
          {`${validRows}/${MAX_INDEX + 1}`}
        </div>
        <div className="loot-items">
          {items.map((item, index) => (
            <input
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
              placeholder={index === firstEmptyIndex ? "Add Loot..." : ""}
              onKeyDown={({ key }) => {
                if (key === "ArrowDown" || key.includes("Enter")) {
                  if (items[index].length > 0 && index < MAX_INDEX) {
                    inputRefs.current[index + 1].focus();
                  }
                }
                if (key === "ArrowUp") {
                  if (index > MIN_INDEX) {
                    inputRefs.current[index - 1].focus();
                  }
                }
              }}
              onFocus={(event) => {
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
                  .getData("text")
                  .split("\n")
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
        {emptyRows < TOTAL_ROWS && (
          <div
            className={
              hasEmptyItem ? "submit-button disabled" : "submit-button"
            }
            onClick={() => {}}
          >
            Generate
          </div>
        )}
      </div>
  )
}

export default LootBag;
