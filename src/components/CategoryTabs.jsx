export default function CategoryTabs({ categories, selectedCategory, onSelectCategory }) {

    return (
      <div>
        <div className="tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={category.id === selectedCategory ? 'active' : ''}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    );
}
