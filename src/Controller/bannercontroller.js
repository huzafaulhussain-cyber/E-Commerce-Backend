const Banner = require("../model/Bannermodel.js");

// 1. Banner Save karne ke liye (Admin Panel ke liye)
const updateBanners = async (req, res) => {
  // console.log("📢 REQUEST RECEIVED IN BANNER CONTROLLER");  
  // console.log("📦 DATA SENT FROM FRONTEND:", req.body);     

  try {
    const { images } = req.body;
    
    if(!images || images.length === 0) {
        console.log("⚠️ ERROR: No images found in request body");
        return res.status(400).send({message: "No images provided"});
    }

    let banner = await Banner.findOne();
    console.log("🔍 DATABASE CHECK: Existing banner found?", banner ? "YES" : "NO");

    if (banner) {
      banner.images = images;
      await banner.save();
      console.log("✅ Banners UPDATED in Database");
    } else {
      banner = new Banner({ images });
      await banner.save();
      console.log("✅ New Banners CREATED in Database");
    }

    return res.status(200).send({ message: "Banners Updated!", banner });
  } catch (error) {
    console.log("❌ DATABASE ERROR:", error.message); // Error pakadne ke liye
    return res.status(500).send({ error: error.message });
  }
};

// 2. Banners ko Fetch karne ke liye (Carousel ke liye)
const getBanners = async (req, res) => {
  try {
    const banner = await Banner.findOne();
    // Carousel ko sirf images ka array chahiye ["url1", "url2"]
    res.status(200).send(banner ? banner.images : []);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = { updateBanners, getBanners };