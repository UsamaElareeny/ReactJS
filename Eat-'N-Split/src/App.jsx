import { useState } from "react";

export default function App() {
  const [addFriendEnabled, setAddFriendEnabled] = useState(false);
  const [friendList, setFriendList] = useState([
    {
      id: 118836,
      name: "Clark",
      image: "https://i.pravatar.cc/48?u=118836",
      balance: 0,
    },
    {
      id: 933372,
      name: "Sarah",
      image: "https://i.pravatar.cc/48?u=933372",
      balance: 0,
    },
    {
      id: 499476,
      name: "Anthony",
      image: "https://i.pravatar.cc/48?u=499476",
      balance: 0,
    },
  ]);
  const [selectedFriend, setSelectedFriend] = useState({});
  function addSelectedFriend(friend) {
    setSelectedFriend(() => friend);
  }
  function addToFriendList(friend) {
    setFriendList((friends) => [...friends, friend]);
  }
  function handleAddFriend() {
    setAddFriendEnabled((a) => (a = !a));
  }
  function editBalance(friendID, addedBalance) {
    setFriendList((friends) =>
      friends.map((friend) =>
        friend.id === friendID
          ? { ...friend, balance: friend.balance + addedBalance }
          : friend
      )
    );
    console.log(friendList);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friendList}
          onSelectingFriend={addSelectedFriend}
        />
        {addFriendEnabled && <FormAddFriend onAddingFriend={addToFriendList} />}
        <Button onClick={handleAddFriend}>
          {addFriendEnabled ? "Close" : "Add Friend"}
        </Button>
      </div>
      <FormSplitBill
        selectedFriend={selectedFriend}
        editBalance={editBalance}
      />
    </div>
  );
}
function FriendList({ friends, onSelectingFriend }) {
  return (
    <ul>
      {friends.map((f) => (
        <Friend friend={f} key={f.id} onSelectingFriend={onSelectingFriend} />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelectingFriend }) {
  const [isSelected, SetIsSelected] = useState(false);
  function handleSelect() {
    SetIsSelected((is) => !is);
    if (isSelected) onSelectingFriend({});
    else onSelectingFriend(friend);
  }
  return (
    <li>
      <img src={friend.image} alt="Friend's Image" />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)} $
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)} $
        </p>
      )}
      {friend.balance === 0 && <p> You and {friend.name} are even</p>}
      <Button onClick={handleSelect}>{isSelected ? "Close" : "Select"}</Button>
    </li>
  );
}
function Button({ onClick, children }) {
  return (
    <button onClick={onClick} className="button">
      {" "}
      {children}{" "}
    </button>
  );
}
function FormAddFriend({ onAddingFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  function AddingFriend(e) {
    e.preventDefault();
    const newFriend = { name, image, id: Date.now(), balance: 0 };
    onAddingFriend(newFriend);
    setImage("");
    setName("");
  }
  return (
    <form className="form-add-friend" onSubmit={AddingFriend}>
      <label>👯Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📷Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button> Add </Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, editBalance }) {
  const [billValue, setBillValue] = useState(0);
  const [myExpense, setMyExpense] = useState(0);
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    if (whoIsPaying === "user")
      editBalance(selectedFriend.id, billValue - myExpense);
    else editBalance(selectedFriend.id, myExpense - billValue);
    setBillValue(0);
    setMyExpense(0);
    setWhoIsPaying("user");
  }
  return (
    <form className="form-split-bill" onSubmit={(e) => handleSubmit(e)}>
      <h2>SPlit a bill with {selectedFriend.name}</h2>
      <label>🤑 Bill Value</label>
      <input
        type="number"
        value={billValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
      />

      <label>🤑 Your Expense</label>
      <input
        type="number"
        value={myExpense}
        onChange={(e) => setMyExpense(Number(e.target.value))}
      />

      <label>🤑 {selectedFriend.name}'s Expense</label>
      <input type="number" value={Math.abs(myExpense - billValue)} disabled />
      <label>🤑 Who Is Paying the Bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        {selectedFriend && (
          <option value="friend">{selectedFriend.name}</option>
        )}
      </select>
      <Button> Split Bill </Button>
    </form>
  );
}
