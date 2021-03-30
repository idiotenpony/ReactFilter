export default function FilterStatus({ filteredProducts }) {
  const cssClasses = `filter-status ${
    filteredProducts === 0 ? "filter-status--no-results" : ""
  }`;

  return (
    <div className={cssClasses}>
      <p>{getFilterStatus(filteredProducts)}</p>
    </div>
  );
}

function getFilterStatus(filteredProducts) {
  let filterCount = `${filteredProducts} Produkte gefunden.`;
  if (filteredProducts === 0) {
    filterCount = `Keine Produkte gefunden.`;
  } else if (filteredProducts === 1) {
    filterCount = `Ein Produkt gefunden.`;
  }
  return filterCount;
}

/* Als Switch Statement:

function getFilterStatus(filteredProducts){
    switch(filteredProducts)

    case 0:
        return "Kein Produkt gefunden.";
    case 1:
        return "Ein Produkt gefunden.";
    default:
        return `${filteredProducts} Produkte gefunden.`;
}
*/
