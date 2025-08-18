import ProductZoom from "../../components/ProductZoom";


const ProductDetails=()=>{
    return(
        <section className="productDetails section">
            <div className="container">
                <div className="row">
                    <div className="col-md-5">
                        <ProductZoom/>
                    </div>
                    <div className="col-md-7">
                        
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductDetails;