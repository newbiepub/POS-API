import {
    Category,
    Currency,
    Ingredient,
    Product,
    Roles,
    User,
    PaymentMethod,
    PaymentStatus, ProductInventory, IngredientInventory
} from "../server/models/modelConfigs";
import passwordHash from "password-hash";
import faker from 'faker';
import {randomIntegerInRange} from "./helpers";

export async function initData() {
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
            category = [],
            currency = {},
            ingredients = [],
            products = [];

        // Initial Category
        if (!categoryCount) {
            console.log("CREATING CATEGORY");

            for (let i = 0; i < 10; i++) {
                category.push(await new Category({
                    name: faker.commerce.product(),
                    companyId: company._id.toString()
                }).save());
            }
        }

        // Initial Currency
        if (!currencyCount) {
            console.log("CREATING CURRENCY");

            currency = await new Currency({
                name: "VND",
                employeeId: employee._id.toString(),
                companyId: company._id.toString(),
                symbol: "đ"
            }).save();
        }

        // Initial Product
        // if (!productCount) {
        //     console.log("CREATING PRODUCT");
        //
        //     for (let i = 0; i < 20; i++) {
        //         let product = {
        //             name: faker.commerce.productName(),
        //             price: [{
        //                 name: faker.random.word(),
        //                 price: faker.random.number(),
        //                 currency: currency._id.toString()
        //             }],
        //             unit: "cái",
        //             companyId: company._id.toString(),
        //             description: faker.lorem.sentence(),
        //             detail: {},
        //             producer: faker.company.companyName(),
        //             categoryId: category[randomIntegerInRange(0, 9)]._id.toString()
        //         };
        //         product = await new Product(product).save();
        //         // Created Products
        //         products.push(product);
        //     }
        // }
        //
        // if (!ingredientCount) {
        //     console.log("CREATING INGREDIENT");
        //
        //     for (let i = 0; i < 50; i++) {
        //         let ingredient = {
        //             name: faker.commerce.productName(),
        //             description: faker.lorem.sentence(),
        //             price: faker.random.number(),
        //             unit: "cái",
        //             companyId: company._id.toString()
        //         };
        //         ingredient = await new Ingredient(ingredient).save();
        //         // Created Ingredients
        //         ingredients.push(ingredient);
        //     }
        // }
        //
        // // Initial Inventory
        // let productInventoryCount = await ProductInventory.find().count().exec();
        // let ingredientInventoryCount = await IngredientInventory.find().count().exec();
        // // Initial Product
        // if(!productInventoryCount) {
        //     products.forEach(product => {
        //         new ProductInventory({
        //             product: product._id,
        //             quantity: faker.random.number(),
        //             employeeId: employee._id,
        //             description: ""
        //         }).save();
        //
        //         new ProductInventory({
        //             product: product._id,
        //             quantity: faker.random.number() * 100,
        //             companyId: company._id,
        //             description: ""
        //         }).save();
        //     })
        // }
        // // Initial Ingredient
        // if(!ingredientInventoryCount) {
        //     ingredients.forEach(ingredient => {
        //         new IngredientInventory({
        //             ingredient: ingredient._id,
        //             quantity: faker.random.number(),
        //             employeeId: employee._id,
        //             description: ""
        //         }).save();
        //
        //         new IngredientInventory({
        //             ingredient: ingredient._id,
        //             quantity: faker.random.number() * 100,
        //             companyId: company._id,
        //             description: ""
        //         }).save();
        //     })
        // }


        let paymentStatusCount = await PaymentStatus.find().count().exec(),
            paymentMethodCount = await PaymentMethod.find().count().exec();
        if (paymentStatusCount === 0) {
            await new PaymentStatus({
                type: 'paid',
                name: 'Đã thanh toán'
            }).save();
            await new PaymentStatus({
                type: 'unpaid',
                name: 'Chưa thanh toán'
            }).save();
            await new PaymentStatus({
                type: 'indebtedness',
                name: 'Trả thiếu'
            }).save()
        }


        if (paymentMethodCount === 0) {
            await new PaymentMethod({
                type: 'prepaid',
                name: 'Trả trước'
            }).save();
            await new PaymentMethod({
                type: 'postpaid',
                name: 'Trả sau'
            }).save();
            await new PaymentMethod({
                type: 'underpayment',
                name: 'Công nợ'
            }).save();

        }
        console.log("INITIAL DONE");
    } catch (e) {
        throw e;
    }
}