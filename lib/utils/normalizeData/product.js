const normalize_product = (product) => {
    return {
        productCode: product.productCode || '',
        name: product.name || '',
        category: product.category || '',
        importPrice: +product.priceImport || 0,
        prices: [{
            name: 'default',
            price: +product.salePrice || 0
        }],
        unit: product.unit || '',
        quantity: +product.quantity || 0
    }
}

export { normalize_product }