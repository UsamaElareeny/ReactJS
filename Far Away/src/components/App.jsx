/*
In this Project, we discovered
1. Controlled elements
  - We have a new concept called Controlled Elements
    - The state of elements like the form is always registered in the DOM
    - We use controlled elements (Stats) to move the the state of the form from the DOM
    to React 
2. Lifting States Up
3. Derived States
4. Child Props
*/
import { useState } from "react";
import "./Logo";
import "./Form";
import "./PackingList";
import "./Stats";

export default function App() {
  const [items, SetItems] = useState([]);
  function onAddItems(item) {
    SetItems((items) => [...items, item]);
  }
  function onDeleteItems(itemID) {
    SetItems((items) => items.filter((i) => i.id != itemID));
  }
  function onToggleItem(itemID) {
    SetItems((items) =>
      items.map((i) => (i.id === itemID ? { ...i, packed: !i.packed } : i))
    );
  }
  function onClearItems() {
    SetItems(() => []);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={onAddItems} />
      <PackingList
        items={items}
        onDeleteItems={onDeleteItems}
        onToggleItem={onToggleItem}
        onClearItems={onClearItems}
      />
      <Stats items={items} />
    </div>
  );
}
