const Review = require("../model/reviewmodel.js");
const Product = require("../model/productmodel.js");

async function createReview(reqData, user) {
  console.log("Creating Review for Product ID:", reqData.productId); // Check karo ID aa rahi hai ya nahi

  // 1. Product dhoondo
  const product = await Product.findById(reqData.productId);

  // Agar product na mile to yahin rok do
  if (!product) {
    console.error("Product not found in DB!");
    throw new Error("Product not found with id: " + reqData.productId);
  }

  // 2. Review ka object banao
  const review = new Review({
    user: user._id,
    product: product._id,
    review: reqData.review,
    rating: reqData.rating,
    createdAt: new Date(),
  });

  // 3. Pehle Review ko save karo (Taake Review ID ban jaye)
  const savedReview = await review.save();

  // 4. Ab Product ke andar Review ID push karo (Try-Catch ke sath)
  try {
    product.reviews.push(savedReview._id);
    await product.save(); // Yahan aksar error aata hai agar product data ghalat ho
  } catch (error) {
    console.error("Product update failed (Review saved but not linked):", error.message);
    // Hum yahan error throw nahi karenge taake Review kam az kam save ho jaye
  }

  return savedReview;
}

async function getAllReviews(productId) {
  return await Review.find({ product: productId })
    .populate("user", "firstName lastName email")
    .sort({ createdAt: -1 });
}
        
async function deleteReview(reviewId, userId) {
  // 1. Review dhoondo
  const review = await Review.findById(reviewId);
  
  if (!review) {
    throw new Error("Review not found");
  }

  // 2. Check karo: Kya delete karne wala wahi banda hai jisne review likha tha?
  // (userId ko String mein convert karke compare karte hain)
  if (review.user.toString() !== userId.toString()) {
    throw new Error("You can't delete another user's review");
  }

  // 3. Delete karo
  return await Review.findByIdAndDelete(reviewId);
}

module.exports = {
  createReview,
  getAllReviews,
  deleteReview
};