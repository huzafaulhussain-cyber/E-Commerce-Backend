const Product = require("../model/productmodel");
const Category = require("../model/categorymodel");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file);
    return result.url;
  } catch (error) {
    console.log(error);
  }
}

async function createProduct(reqData) {
  let topLevel = await Category.findOne({
    $or: [
      { _id: reqData.topLevelCategory.match(/^[0-9a-fA-F]{24}$/) ? reqData.topLevelCategory : null },
      { name: reqData.topLevelCategory }
    ]
  });

  if (!topLevel) {
    topLevel = new Category({
      name: reqData.topLevelCategory,
      level: 1
    });
    await topLevel.save();
  }

  let secondLevel = await Category.findOne({
    $or: [
      { _id: reqData.secondLevelCategory.match(/^[0-9a-fA-F]{24}$/) ? reqData.secondLevelCategory : null },
      { name: reqData.secondLevelCategory }
    ],
    parent: topLevel._id, // Corrected: parentCategory -> parent
  });

  if (!secondLevel) {
    secondLevel = new Category({
      name: reqData.secondLevelCategory,
      parent: topLevel._id, // Corrected: parentCategory -> parent
      level: 2,
    });
    await secondLevel.save();
  }

  let thirdLevel = await Category.findOne({
    $or: [
      { _id: reqData.thirdLevelCategory.match(/^[0-9a-fA-F]{24}$/) ? reqData.thirdLevelCategory : null },
      { name: reqData.thirdLevelCategory }
    ],
    parent: secondLevel._id, // Corrected: parentCategory -> parent
  });

  if (!thirdLevel) {
    thirdLevel = new Category({
      name: reqData.thirdLevelCategory,
      parent: secondLevel._id, // Corrected: parentCategory -> parent
      level: 3,
    });
    await thirdLevel.save();
  }

  const sanitizedSizes = reqData.size
    .filter(s => s.name && s.quantity !== "" && Number(s.quantity) >= 0)
    .map(s => ({
      name: s.name,
      quantity: Number(s.quantity)
    }));

  const product = new Product({
    title: reqData.title,
    color: reqData.color,
    description: reqData.description,
    discountedPrice: Number(reqData.discountedPrice),
    discountPercent: Number(reqData.discountPercent),
    imageUrl: reqData.imageUrl,
    brand: reqData.brand,
    price: Number(reqData.price),
    sizes: sanitizedSizes,
    quantity: Number(reqData.quantity),
    category: thirdLevel._id,
    images: reqData.images || [],
    createdAt: new Date()
  });

  const savedProduct = await product.save();
  return savedProduct;
}

async function findProductById(id) {
  const product = await Product.findById(id)
    .populate({
      path: "category",
      populate: { path: "parent", populate: { path: "parent" } } // Corrected: parentCategory -> parent
    })
    .exec();

  if (!product) throw new Error("Product not found with id " + id);
  return product;
}



async function getAllProducts(reqQuery) {
    console.log("Filters received from frontend:", reqQuery);

    let {
        category,
        color,
        sizes,
        minPrice,
        maxPrice,
        minDiscount,
        sort,
        stock,
        pageNumber,
        pageSize,
    } = reqQuery;

    pageSize = parseInt(pageSize) || 10;
    pageNumber = parseInt(pageNumber) || 1;
    let filter = {};

    // 1. Category Filter
    if (category && category !== "" && category !== "null") {
        const existCategory = await Category.findOne({ slug: category });
        if (existCategory) {
            filter.category = existCategory._id;
        } else {
            return { content: [], currentPage: 1, totalPages: 0 };
        }
    }

    // 2. Color Filter
    if (color && color !== "") {
        const colorSet = new Set(color.split(",").map(c => c.trim()).filter(c => c));
        if (colorSet.size > 0) {
            filter.color = { $regex: new RegExp([...colorSet].join("|"), "i") };
        }
    }

    // 3. Price Filter (Zaroori: String ko Number mein badalna)
    const minP = parseInt(minPrice) || 0;
    const maxP = parseInt(maxPrice) || 1000000;
    filter.discountedPrice = { $gte: minP, $lte: maxP };

    // 4. Discount Filter (Zaroori: Field name 'discountPercent' hai)
    const minD = parseInt(minDiscount) || 0;
    if (minD > 0) {
        filter.discountPercent = { $gte: minD }; 
    }

    // 5. Stock Filter
    if (stock) {
        if (stock === "in_stock") filter.quantity = { $gt: 0 };
        else if (stock === "out_of_stock") filter.quantity = { $lte: 0 };
    }

    console.log("Final MongoDB Filter (Corrected):", JSON.stringify(filter, null, 2));

    const totalProducts = await Product.countDocuments(filter);
    const skip = (pageNumber - 1) * pageSize;

    let query = Product.find(filter)
        .populate({
            path: 'category',
            populate: { path: 'parent', populate: { path: 'parent' } }
        })
        .skip(skip)
        .limit(pageSize);

    if (sort) {
        const sortDirection = sort === "price_high" ? -1 : 1;
        query = query.sort({ discountedPrice: sortDirection });
    }

    const products = await query.exec();
    const totalPages = Math.ceil(totalProducts / pageSize);

    return { content: products, currentPage: pageNumber, totalPages };
}


 
module.exports = {
  createProduct,
  deleteProduct: async (productId) => await Product.findByIdAndDelete(productId),
  updateProduct: async (productId, reqData) => await Product.findByIdAndUpdate(productId, reqData),
  findProductById,
  getAllProducts,
  uploadImage
};