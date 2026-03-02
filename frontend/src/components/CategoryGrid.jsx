export default function CategoryGrid({ categories, selected, onSelect }) {
  return (
    <div className="category-grid">
      {categories.map((category) => (
        <button
          key={category}
          className={selected === category ? 'chip active' : 'chip'}
          onClick={() => onSelect(selected === category ? '' : category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
