import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    const newSumAmount = {...sumAmount};
    newSumAmount[product.id] = product.amount;

    return newSumAmount
  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('products')
      const formattedProducts = response.data.map(( product:Product ) => {
        const priceFormatted = formatPrice(product.price)

        const returnProduct: ProductFormatted = {
          id: product.id,
          image: product.image,
          price: product.price,
          priceFormatted: priceFormatted,
          title: product.title,
        }
        return returnProduct
      })

      setProducts(formattedProducts)
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id)
  }

  return (
    <ProductList>
      {products.map( product => {
        
        return (
          <li key={product.id}>
          <img src={product.image} />
          <strong>{product.title}</strong>
          <span>{formatPrice(product.price)}</span>
          <button
            type="button"
            data-testid="add-product-button"
          onClick={() => handleAddProduct(product.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              { cartItemsAmount[product.id] || 0 }
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
          </li>
        )
      })}
     
    </ProductList>
  );
};

export default Home;
