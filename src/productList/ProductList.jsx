// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as config from '../config';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'


// Mock data
import { mockProductList } from '../__test__/mocks/products-mocks';

// Styles
import './ProductList.css';

const ProductList = (props) => {
  const [productId, setProductId] = useState('');
  const [productsArr, setProducts] = useState([]);
  const [productmodalshow, setProductModalShow] = useState(false);
  const [modalshowproduct, setModalShowProduct] = useState('');
  useEffect(() => {
    if (config.USE_MOCK_DATA) {
      const { products } = mockProductList.data;
      setProducts(products)
    } else {
      const url = config.GET_PRODUCTS_API;
      const options = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      };

      fetch(url, options)
      .then(response => response.json())
      .then(data => {
        const products = [];
        for (let i=0; i<data.Items.length; i++) {
          // parse product details based on their types (S=string, N=Number)
          const product = {
            "id": data.Items[i].id.S || data.Items[i].id.N || data.Items[i].id,
            "name": data.Items[i].name.S || data.Items[i].name.N || data.Items[i].name,
            "imageUrl": data.Items[i].imageUrl.S || data.Items[i].imageUrl.N || data.Items[i].imageUrl,
            "imageLargeUrl": data.Items[i].imageLargeUrl.S || data.Items[i].imageLargeUrl.N || data.Items[i].imageLargeUrl,
            "price": data.Items[i].price.S || data.Items[i].price.N || data.Items[i].price,
            "discountedPrice": data.Items[i].discountedPrice.S || data.Items[i].discountedPrice.N || data.Items[i].discountedPrice,
            "longDescription": data.Items[i].longDescription.S || data.Items[i].longDescription.N || data.Items[i].longDescription,
          }
          products.push(product);
        }

        // sort by ID in ascending order
        products.sort((a, b) => {
          return (a.id - b.id)
        })

        // save the products in local store
        setProducts(products)
      })
      .catch(() => {
        console.log('Error');
      });
    }
  }, [])

  useEffect(() => {
    scrollToCurrentProduct();
  })

  const handleProductClick = (id) => {
    const details = productsArr.filter(product => product.id === id);
    setModalShowProduct(details[0]);
    console.log(modalshowproduct)
    setProductModalShow(true)
  }

  const handleClose = () => {
    setProductModalShow(false)
  };

  const renderProductList = () => {
    const { currentProductId } = props;
    return (
      
      productsArr.map(product => {
        const { id, name, price, discountedPrice } = product;
        let { imageUrl } = product;

        // if using mock data, refernce the images in the public folder
        if (config.USE_MOCK_DATA) {
          imageUrl = `${process.env.PUBLIC_URL}/${imageUrl}`;
        }

        const current = (currentProductId && currentProductId === id) ? 'product-current' : '';
        const onSale = (price !== discountedPrice) ? 'product-onsale' : '';

        return (
          <>
            <div className={`productionListItem mouse_pointer ${current}` } key = {id} onClick={() => {handleProductClick(id)}}>
              <div className='row'>
                <div className='col-4 col-sm-3 col-md-12 col-lg-3'>
                  <img src={imageUrl} alt={id} style={{ width: '100%', height: 'auto' }}></img>
                </div>
                <div className='col-8 col-sm-9 col-md-12 col-lg-9 text-start production-info'>
                  <p className='title fw-bold'>{name}</p>
                  <p className='subtitle'>Care Instruction: Gentle Machiune</p>
                  <p className='readmore danger'>Read more</p>
                  <p className='price fw-bold'>{`$${price}`} <del>{`$${discountedPrice}`}</del></p>
                </div>
              </div>
            </div>
          </>
        )
      })
    )
  }

  const scrollToCurrentProduct = () => {
    const element = document.getElementsByClassName("product-current");
    if (element.length) {
      element[0].scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
  }

  return (
    <div className="products-container bg-alt br-all pd-1">
      <div className="product-list fl fl-nowrap bg-alt br-all">
        {renderProductList()}
      </div>
      <Modal show={productmodalshow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Welcome to Live Shopping</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={`${process.env.PUBLIC_URL}/${modalshowproduct.imageUrl}`} alt={modalshowproduct.id} style={{ width: '100%', height: 'auto' }}></img>
          <h4>{modalshowproduct.name}</h4>
          <p>{modalshowproduct.longDescription}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" style={{width : "100%"}}>
          <a href='https://www.styley.co/cactus-en-pot/204-2365-me-fais-pas-crever-cactus.html#/66-base-fasciata' style={{ textDecoration: 'none', color: 'white' }}>
            {modalshowproduct.price} * Buy Now
          </a>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

ProductList.propTypes = {
  currentProductId: PropTypes.string,
  setModal: PropTypes.func,
  showModal: PropTypes.bool,
};

export default ProductList;
