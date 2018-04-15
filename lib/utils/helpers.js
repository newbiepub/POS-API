import log from "node-pretty-log";

/**
 * Logger
 * @param type
 * @param message
 * @returns {*}
 */
export const logger = (type, ...args) => {
    log.apply(log, [type, ...args]);
}

/**
 * @return {string}
 */
const UUIDGeneratorNode = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

/**
 * Token ttl
 * @returns {number}
 */

const ttl = () => {
    let today = new Date();
    let nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
    return nextWeek.getTime();
};

/**
 * Convert Products Field Data
 */
function convertField (fieldName) {
    switch (fieldName) {
        case "TÊN SẢN PHẨM (*)": {
            return "name";
        }
        case "GIÁ NHẬP (*)": {
            return "priceImport"
        }
        case "GIÁ BÁN (*)": {
            return "priceSale"
        }
        case "ĐƠN VỊ (*)": {
            return "unit"
        }
        case "SỐ LƯỢNG (*)": {
            return 'quantity'
        }
        case "MÔ TẢ SẢN PHẨM": {
            return "description"
        }
        case "LOẠI HÀNG (*)": {
            return "category"
        }
        case "MÃ SẢN PHẨM": {
            return "productCode"
        }
        default: return undefined;
    }
}

/**
 * Normalize Price push to product prices array
 * Price with default currency is VND
 */
const addPriceToArray = (products, priceName, priceField, ratio) => products.reduce( async (result, product) => {
    try {
        const { Currency } = require('../server/models/modelConfigs');
        let currency = await Currency.findOne({name: "VND"}, {_id: true}).exec();

        let price = [
            {
                name: priceName,
                price: product[priceField] + (+product[priceField] * ratio),
                currency: currency._id.toString()
            }
        ];

        result = await result;
        if(product.price != undefined && product.price.constructor === Array) {
            product.price = product.price.concat(price);
        } else {
            product.price = price
        }
        result.push(product);
    } catch (e) {
        console.log(e.message);
    }
    return result;
}, []);

/**
 * Export CSV Data to JSON
 * @param data
 */
function csvDataToJSON(data) {
    try {
        return data.map(item => {
            // Merge product attributes
            Object.keys(item).forEach((field) => {
                item[convertField(field)] = item[field];
                delete item[field]; // Remove old field
            });
            return item;
        })
    } catch(e) {
        console.log("ERROR - ", e.message);
        throw e;
    }
}

/**
 * Random Number
 * @param min
 * @param max
 */

const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Deep comparision
 * @param a
 * @param b
 * @returns {boolean}
 */
const equals = (a, b) => {
    if (a === b) return true;
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
    if (!a || !b || (typeof a != 'object' && typeof b !== 'object')) return a === b;
    if (a === null || a === undefined || b === null || b === undefined) return false;
    if (a.prototype !== b.prototype) return false;
    let keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
    return keys.every(k => equals(a[k], b[k]));
};

export {UUIDGeneratorNode, ttl, addPriceToArray, csvDataToJSON, randomIntegerInRange, equals };