import Product from "./Product";


export default function ProductsList({products}) {
    return (
        <section className="products">
            {products.map((product) => <Product key={product.id} {...product} />)}
        </section>
    )
}
