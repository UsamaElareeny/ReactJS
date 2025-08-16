export default function Stats({ items }) {
  const numItems = items.length;
  const packedItems = items.filter((i) => i.packed).length;
  const percentage = Math.round((packedItems / numItems) * 100);
  return (
    <footer className="stats">
      {items.length == 0 ? (
        <em> Start Adding Some Items To Your Packing List 🚀</em>
      ) : (
        <em>
          {percentage === 100
            ? "You Got Everthing. Ready to Go ✈️"
            : `👜You have ${numItems} items on your list, and you have already packed
        ${packedItems} (${percentage}%)`}
        </em>
      )}
    </footer>
  );
}
