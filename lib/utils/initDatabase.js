import {Category, Currency, Ingredient, Inventory, Product, Roles, User} from "../server/models/modelConfigs";
import passwordHash from "password-hash";
import * as _ from "lodash";
import faker from 'faker';

export async function initData () {
    try {
        let employee = null,
            company = null;

        // Create Roles
        let rolesCount = await Roles.find().count().exec(),
            adminRole = "",
            employeeRole = "";
        if (!rolesCount) {
            console.log("CREATING ROLES");

            adminRole = await new Roles({
                roleName: "company"
            }).save();
            employeeRole = await new Roles({
                roleName: "employee"
            }).save();
        }

        // Initial User
        let userCount = await User.find().count().exec();
        if (!userCount) {
            console.log("CREATING COMPANY");

            company = await new User({
                email: "lam@example.com",
                password: passwordHash.generate("123456"),
                profile: {
                    name: "Lam Nguyen",
                    address: "K43/59 Lê Hữu Trác",
                    phoneNumber: "1282066863"
                },
                roles: [adminRole._id.toString()]
            }).save();

            console.log("CREATING EMPLOYEE");

            employee = await new User({
                username: "lamnguyen2306",
                password: passwordHash.generate("123456"),
                profile: {
                    name: "POS-01",
                    address: "K69/96 No Name",
                    phoneNumber: "123456789"
                },
                roles: [employeeRole._id.toString()],
                companyId: company._id.toString()
            }).save();
        }

        let categoryCount = await Category.find().count().exec(),
            productCount = await Product.find().count().exec(),
            currencyCount = await Currency.find().count().exec(),
            ingredientCount = await Ingredient.find().count().exec(),
            inventoryCount = await Inventory.find().count().exec(),
            category = [],
            currency = {},
            companyInventory = null;

        // Initial Category
        if(!categoryCount) {
            console.log("CREATING CATEGORY");

            for (let i = 0; i < 10; i++) {
                category.push( await new Category({
                    name: faker.commerce.product(),
                    companyId: company._id.toString()
                }).save());
            }
        }

        // Initial Currency
        if(!currencyCount) {
            console.log("CREATING CURRENCY");

            currency = await new Currency({
                name: "VND",
                employeeId: employee._id.toString(),
                companyId: company._id.toString(),
                symbol: "đ"
            }).save();
        }

        // Initial Product
        if(!productCount) {
            console.log("CREATING PRODUCT");

            let productItems = [];

            for (let i = 0; i < 20; i++) {
                let product = {
                    name: faker.commerce.productName(),
                    price: [{name: faker.random.word(), price: faker.random.number(), currency: currency._id.toString()}],
                    unit: "cái",
                    companyId: company._id.toString(),
                    description: faker.lorem.sentence(),
                    detail: {},
                    producer: faker.company.companyName(),
                    categoryId: category[_.random(0, 9)]._id.toString()
                };
                let item = await new Product(product).save();
                productItems.push(item);
            }

            companyInventory = await new Inventory({
                productItem: _.map(productItems, (item) => {
                    return {productId: item._id.toString(), quantity: faker.random.number()}
                }),
                companyId: company._id.toString(),
            }).save();

            console.log("CREATE POS INVENTORY");
            await new Inventory({
                productItem: [],
                ingredientItem: [],
                employeeId: employee._id.toString(),
            }).save();
        }

        if(!ingredientCount) {
            console.log("CREATING INGREDIENT");

            let ingredientItems = [];

            for(let i = 0; i < 50; i++) {
                let ingredient = {
                    name: faker.commerce.productName(),
                    description: faker.lorem.sentence(),
                    price: faker.random.number(),
                    unit: "cái",
                    companyId: company._id.toString()
                };
                ingredientItems.push(await new Ingredient(ingredient).save());
            }

            await Inventory.update({_id: companyInventory._id}, {$set: {
                ingredientItem: _.map(ingredientItems, (item) => {
                    return {
                        ingredientId: item._id.toString(),
                        quantity: faker.random.number()
                    }
                })
            }}).exec();
        }

        console.log("INITIAL DONE");
    } catch (e) {
        throw e;
    }
}