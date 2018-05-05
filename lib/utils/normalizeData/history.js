export const normalize_inventory_history_products = (item) => {
    let { product = {}} = item;
    let { categoryId = {name: 'Không có'} } = product;
    return {
        "productCode" : product.productCode || '',
        "name" : product.name || '',
        "category" : categoryId.name || '',
        "importPrice" : item.importPrice || 0,
        "prices" : item.prices || [],
        "unit" : product.unit || '',
        "quantity" : item.quantity || 0
    }
}