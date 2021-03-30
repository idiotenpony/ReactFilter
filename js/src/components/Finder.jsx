import { useEffect, useState } from "react";

import products from "../products";
import FilterForm from "./FilterForm";
import FilterStatus from "./FilterStatus";
import ProductsList from "./ProductsList";

export default function Finder() {
  const [saleOnly, setSaleOnly] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      (document.title = `Suche: ${keyword} ${
        saleOnly ? "im Sonderangebot" : ""
      }`),
    [keyword, saleOnly]
    );
  
    useEffect(() => {
    /* Lese Daten aus der am Anfang geladenen URL aus und stelle
    den vorhergehenden State wieder her. */
    const url = new URL(window.location.href);
  
    const oldKeyword = url.searchParams.get("keyword");
    if (oldKeyword) {
      setKeyword(oldKeyword);
    }
  
    const oldCategory = url.searchParams.get("category");
    if (oldCategory) {
      setSelectedCategory(parseInt(oldCategory));
    }
  
    const oldSale = url.searchParams.get("sale");
    if (oldSale === "true") {
      setSaleOnly(true);
    }
  
    // "Ladevorgang" ist beendet
    setLoading(false);
    // Leerer Dependency-Array sorgt dafür, dass diese Funktion nur
    // einmal bei der ersten Darstellung ausgeführt wird.
    }, []);
  
    useEffect(() => {
    // Konstruiere ein neues URL-Objekt auf Grundlage der aktuellen Url
    const url = new URL(window.location.href);
  
    // Entferne eventuellen keyword-Parameter
    url.searchParams.delete("keyword");
    // Falls keyword nicht leer ist, füge den Keyword-Parameter hinzu
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    }
  
    url.searchParams.delete("category");
    if (selectedCategory) {
      url.searchParams.set("category", selectedCategory);
    }
  
    url.searchParams.delete("sale");
    if (saleOnly) {
      url.searchParams.set("sale", saleOnly);
    }
  
    // Ersetze den aktuellen Eintrag im Browser-Verlauf mit der neu
    // erzeugten URL
    window.history.replaceState({}, "", url);
    }, [keyword, selectedCategory, saleOnly]);
  
    // Stelle beim ersten Durchgang (bei dem die alte URL noch nicht wiederhergestellt
    // wurde) nichts dar, um Flackern zu verhindern.
    if (loading) {
    return null; // Wenn null zurückgegeben wird, wird nichts dargestellt
    }
   
  

  /* Gebe alle Produkte in die Filterfunktion und erhalte
  nur die zurück, die den aktuellen Filtereinstellungen entsprechen. */
  const filteredProducts = getFilteredProducts(
    products,
    saleOnly,
    keyword,
    selectedCategory
  );

  return (
    <div className="shop">
      <FilterForm
        saleOnly={saleOnly}
        setSaleOnly={setSaleOnly}
        keyword={keyword}
        setKeyword={setKeyword}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <FilterStatus filteredProducts={filteredProducts.length} />
      <ProductsList products={filteredProducts} />
    </div>
  );
}

function getFilteredProducts(products, saleOnly, keyword, selectedCategory) {
  /* Speichere die Information, ob der Filter NICHT aktiv ist */
  const noSaleFilter = !saleOnly;
  /* Prüfe, ob mindestens 2 Zeichen eingegeben wurden */
  const noKeywordFilter = keyword.length < 2;

  /* Prüfe, ob eine Kategorie ausgewählt wurde */
  const noCategoryFilter = selectedCategory === 0;

  /* RegExp = Regulärer Ausdruck (Regular Expression)*/
  /*   Regulärer Ausdruck, um zu testen, ob ein Muster in einem
  anderen String vorkommt. "i" bedeutet "case insensitive",
  also Großschreibung ignorieren.
  Das RegExp-Objekt hat u.a. die Methode test(), um zu prüfen, ob ein String
  die Bedingungen des regulären Ausdrucks erfüllt.
  https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp */

  const keywordRegExp = new RegExp(keyword, "i");

  const filteredProducts = products
    .filter(
      /* Entweder der Filter ist nicht aktiv, dann wird für alle
	Produkte true zurückgegeben, und es kommen entspechend
	alle durch den Filter. Andernfalls nur die, bei denen
	product.sale true ist */
      (product) => noSaleFilter || product.sale
    )
    .filter((product) => noKeywordFilter || keywordRegExp.test(product.title))
    .filter(
      (product) => noCategoryFilter || selectedCategory === product.category
    );

  return filteredProducts;
}
