const { app } = require('./app');
const { db } = require('./utils/db.util');

// Models
const { User } = require('./models/user.model');
const { ProductInCart } = require('./models/productInCart.model');
const { ProductImg } = require('./models/productImg.model');
const { Product } = require('./models/product.model');
const { Order } = require('./models/order.model');
const { Categorie } = require('./models/categorie.model');
const { Cart } = require('./models/cart.model');

//relations

//User to Order relations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User);

//User to Product relations
User.hasMany(Product, { foreignKey: 'userId' });
Product.belongsTo(User);
//User to Cart relations
User.hasOne(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User);

//Orders to cart
Cart.hasOne(Order, { foreignKey: 'cartId' });
Order.belongsTo(Cart);

//Product to product Imgs
Product.hasMany(ProductImg, { foreignKey: 'productId' });
ProductImg.belongsTo(Product);

//Product to categories
Categorie.hasOne(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Categorie);

//Product to productincart
Product.hasOne(ProductInCart, { foreignKey: 'productId' });
ProductInCart.belongsTo(Product);

//cart to products in cart
Cart.hasMany(ProductInCart, { foreignKey: 'cartId' });
ProductInCart.belongsTo(Cart);


//init server
db.authenticate()
    .then(() => console.log('db authenticate'))
    .catch((err) => console.log(err));

db.sync()
    .then(() => console.log('db sync'))
    .catch((err) => console.log(err));


const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`express server running on port: ${PORT}`);
});