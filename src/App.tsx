import "./App.css";

import React, { useRef, useState } from "react";

interface Loot {
  index: number;
  items: Array<string>;
}

const TOTAL_ROWS = 8;
const MIN_INDEX = 0;
const MAX_INDEX = TOTAL_ROWS - 1;
const MAX_CHARACTERS = 45;

function App(): JSX.Element {
  const [items, setItems] = useState(["", "", "", "", "", "", "", ""]);
  const firstEmptyIndex = items.findIndex((value, index) => value.length === 0);
  const hasEmptyItem = firstEmptyIndex !== -1;
  const inputRefs = useRef<Array<HTMLInputElement>>([]);
  const emptyRows = items.reduce((total, item) => {
    return item.length === 0 ? total + 1 : total;
  }, 0);
  const validRows = TOTAL_ROWS - emptyRows;

  return (
    <div className="App">
      <div className="loot-view">
        <div
          className={validRows === 0 ? "item-counter empty" : "item-counter"}
        >
          {`${validRows}/${MAX_INDEX + 1}`}
        </div>
        <div className="loot-items">
          {items.map((item, index) => (
            <input
              key={`loot-item-$index`}
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
                const newItems = [...items];
                newItems[index] = target.value.trimEnd();
                setItems(newItems);
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
    </div>
  );
}

export default App;
