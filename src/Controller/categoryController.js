const Category = require("../model/categorymodel");

// ==========================================
// 1. INTERNAL HELPERS (Nesting & Slugs)
// ==========================================

// Slug Generator: "Men's Clothing" -> "mens-clothing"
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const buildTree = (allCategories, parentId = null) => {
  const categoryList = [];
  let filterCats;

  if (parentId === null) {
    // FIX: Level 1 filter karein aur Level 0 (Settings) ko nikaal dein
    filterCats = allCategories.filter(cat => cat.level === 1); 
  } else {
    filterCats = allCategories.filter(cat => 
      cat.parent && cat.parent.toString() === parentId.toString()
    );
  }

  for (let cat of filterCats) {
    const children = buildTree(allCategories, cat._id);

    categoryList.push({
      id: cat._id,
      name: cat.name,
      slug: cat.slug,
      level: cat.level,
      image: cat.image,
      featured: cat.featured || [],
      sections: cat.level === 1 ? children : [], 
      items: cat.level === 2 ? children : []
    });
  }
  return categoryList;
};
// ==========================================
// 2. EXPORTED FUNCTIONS (APIs)
// ==========================================

// --- CREATE CATEGORY (Lvl 1, 2, or 3) ---
exports.createCategory = async (req, res) => {
  try {
    const { name, level, parent, image, featured } = req.body;
    const slug = generateSlug(name);

    // Duplication Check (Aik hi level/parent ke niche same naam na ho)
    const existing = await Category.findOne({ name, parent: parent || null });
    if (existing) return res.status(400).json({ message: "Yeh category yahan pehle se hai!" });

    const category = new Category({
      name,
      slug,
      level: parseInt(level),
      parent: parent || null,
      image: image || "",
      featured: level === 1 ? featured : [] // Sirf Top level ke liye images
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- GET NAVIGATION TREE (For Navbar) ---
exports.getNavigationTree = async (req, res) => {
  try {
    const all = await Category.find();
    
    // 1. Build hierarchy tree
    const tree = buildTree(all);

    // 2. Get Site Logo
    const settings = await Category.findOne({ slug: "site-settings" });
    const currentLogo = settings ? settings.image : "";

    // Response structure jo Redux mang raha hai
    res.status(200).json({ 
      categories: tree, 
      logo: currentLogo 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- UPDATE BANNERS (Featured Images for Lvl 1) ---
exports.updateBanners = async (req, res) => {
  try {
    const { id, featured } = req.body; 
    const category = await Category.findByIdAndUpdate(
      id, 
      { featured: featured }, 
      { new: true }
    );
    if (!category) return res.status(404).json({ message: "Category nahi mili!" });
    res.status(200).json({ message: "Banners Updated!", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- LOGO & SITE SETTINGS ---
exports.updateLogo = async (req, res) => {
  try {
    const { logo } = req.body;
    let settings = await Category.findOne({ slug: "site-settings" });

    if (settings) {
      settings.image = logo;
      await settings.save();
    } else {
      settings = new Category({
        name: "Site Settings",
        slug: "site-settings",
        level: 0, 
        image: logo
      });
      await settings.save();
    }
    res.status(200).json({ message: "Logo saved!", logo: settings.image });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLogo = async (req, res) => {
  try {
    const settings = await Category.findOne({ slug: "site-settings" });
    res.status(200).json({ logo: settings ? settings.image : "" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- CASCADING DELETE (Mukammal Safaya) ---
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Pehle category ko dhoondo
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category nahi mili!" });

    console.log(`Deleting category: ${category.name} (Level: ${category.level})`);

    // 2. Agar Level 1 delete ho rahi hai
    if (category.level === 1) {
      // Level 2 dhoondo jo is Level 1 ke niche hain
      const level2Cats = await Category.find({ parent: id });
      const level2Ids = level2Cats.map(c => c._id);

      if (level2Ids.length > 0) {
        // Level 3 delete karo (Jo in Level 2 IDs ke parent hain)
        await Category.deleteMany({ parent: { $in: level2Ids } });
        // Phir Level 2 delete karo
        await Category.deleteMany({ parent: id });
      }
    } 
    
    // 3. Agar Level 2 delete ho rahi hai
    else if (category.level === 2) {
      // Iske niche wale Level 3 delete karo
      await Category.deleteMany({ parent: id });
    }

    // 4. Aakhir mein asal main category ko database se udao
    await Category.findByIdAndDelete(id);

    res.status(200).json({ 
      message: "Parent aur uske saare children database se delete ho gaye! 🗑️" 
    });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: error.message });
  }
};
// --- SIMPLE LIST (For Dropdowns) ---
exports.getList = async (req, res) => {
  try {
    const { level, parent } = req.query;
    let query = {};
    if (level) query.level = level;
    if (parent) query.parent = parent;
    const data = await Category.find(query);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- GENERAL UPDATE (Fix: Naya Slug generate hoga) ---
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let updateData = { ...req.body };

    // Agar name update ho raha hai, to naya slug bhi banao
    if (name) {
      updateData.slug = generateSlug(name);
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Category nahi mili!" });
    
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};