import React, { useEffect, useState } from "react";
import { getAllProducts, getProductsByCategory } from "../api/Products";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar"; // Asegúrate de importar el componente SearchBar
import styles from "../styles/ProductList.module.css"; // Importa los estilos del módulo


const ProductsList = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6; // Número de productos por página

  useEffect(() => {
    const fetchProducts = async () => {
      let data;
      if (selectedCategory === "all") {
        data = await getAllProducts();
        setCurrentPage(0);
      } else {
        data = await getProductsByCategory(selectedCategory);
      }
      setProducts(data);
      setDisplayedProducts(data); // Inicialmente muestra todos los productos
    };

    fetchProducts();
  }, [selectedCategory]);

  // Maneja los resultados de búsqueda
  const handleSearchResults = (filteredProducts) => {
    setDisplayedProducts(filteredProducts);
    setCurrentPage(0); // Reinicia la página al buscar
  };

  // Cálculo de productos a mostrar según la página actual
  const paginatedProducts =
    selectedCategory === "all"
      ? displayedProducts.slice(
          currentPage * itemsPerPage,
          (currentPage + 1) * itemsPerPage
        )
      : displayedProducts; // Si no es "all", muestra todos los productos sin paginar

  const handleNext = () => {
    if ((currentPage + 1) * itemsPerPage < displayedProducts.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={`container mt-5  text-center`}>

      <SearchBar products={products} onSearchResults={handleSearchResults} />
      <div className="row ">
        {paginatedProducts.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <Link to={`/product/${product.id}/${product.category}`} className={styles.link}>
              <div className={`card h-100 product-container ${styles.card}`}>
                <div className="image-container">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="card-img-top product-image"
                  />
                  <button
                    className=" btn btn-secondary overlay-text  m-2"
                    title="Detail"
                    style={{
                      border: "none",
                      position: "relative",
                      zIndex: "1",
                      background: "black",
                    }}
                  >
                    <i
                      className="fas fa-eye"
                      style={{ fontSize: "x-large", color: "white" }}
                    ></i>
                  </button>
                  <button
                    className=" btn btn-secondary overlay-text m-2"
                    title="Add Favorites"
                    style={{
                      border: "none",
                      position: "relative",
                      zIndex: "1",
                      background: "#FDB5EB",
                    }}
                  >
                    <i
                      className="fa-solid fa-heart"
                      style={{ fontSize: "x-large", color: "black" }}
                    ></i>
                  </button>
                </div>

                <div className="card-body">
                  <h5 className={`card-title ${styles.title}`}>
                    {product.title}
                  </h5>
                  <p className={`card-text ${styles.price}`}>
                    Precio: ${product.price}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Renderiza los botones de paginación solo cuando selectedCategory es "all" */}
      {selectedCategory === "all" && (
        <div className={styles["button-container"]}>
          <button
            className="btn btn-dark m-2"
            onClick={handlePrevious}
            disabled={currentPage === 0}
          >
            Anterior
          </button>
          <button
            className="btn btn-dark m-2"
            onClick={handleNext}
            disabled={(currentPage + 1) * itemsPerPage >= displayedProducts.length}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
