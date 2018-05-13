
export function numberwithThousandsSeparator(x) {
    try {
        let parts = x.toString().split(",");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return parts.join(",");
    } catch (e) {
        console.warn(e);
        return x;
    }
}

function normalizeTransactionDiscountForInvoice(discount) {
    let result = [];
    for (let itemDiscount of discount) {
        let newItems = {
            name: itemDiscount.name,
            discountValue: itemDiscount.type === "percent" ? `${itemDiscount.value}%` : `${numberwithThousandsSeparator(itemDiscount.value)}đ`
        };
        result.push(newItems);
    }
    return result;
}

export function normalizeTransactionItemForInvoice(item) {
    let invoice = [];
    for (let transactionItem of item) {
        let newItem = {
            productName: transactionItem.productName,
            quantity: transactionItem.quantity,
            unit: transactionItem.unit,
            price: numberwithThousandsSeparator(transactionItem.totalPrice)+ "đ",
            discounts: normalizeTransactionDiscountForInvoice(transactionItem.discounts)
        };

        invoice.push(newItem)
    }
    return invoice
}