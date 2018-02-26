import {each} from "lodash"

/**
 * @return {string}
 */
export function UUIDGeneratorNode() {
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

export const ttl = () => {
    let today = new Date();
    let nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
    return nextWeek.getTime();
};

/**
 * Export CSV Data to JSON
 * @param data
 */
export function csvDataToJSON(data) {
    try {
        let jsonData = {};
        let fields = data[0];
        let fieldData = data.slice(1, data.length); // Data for each field
        console.log("FIELD DATA: ", fieldData);
        // Initial Fields
        each(fields, field => {
            jsonData[field] = null
        });
        // Parse Data from csv
       return fieldData.reduce((result, item) => {
           // New object instance
           jsonData = {...jsonData};
            // Assign data
            for(let index = 0; index < fields.length; index++) {
                jsonData[fields[index]] = item[index];
            }
            result = [...result, jsonData];
            return result;
        }, []);
    } catch(e) {
        console.log("ERROR - ", e.message);
        throw e;
    }
}