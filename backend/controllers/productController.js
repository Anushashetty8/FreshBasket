import Product from "../models/product.model.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      offerPrice,
      category,
      taxRate,
      stock,
      expiryDate,
    } = req.body;

    const image = req.files?.map((file) => file.filename);

    const descriptionArray = description
      ? description.split('\n').filter(line => line.trim() !== '')
      : [];

    if (
      !name ||
      !price ||
      !offerPrice ||
      !category ||
      !descriptionArray.length ||
      !image ||
      image.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields including images are required",
      });
    }

    await Product.create({
      name,
      description: descriptionArray,
      price,
      offerPrice,
      category,
      image,
      taxRate: taxRate || 0,
      stock: stock || 0,
      expiryDate,
    });

    res.status(201).json({
      message: "Product added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      products,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    res.status(200).json({
      product,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    res.status(200).json({
      product,
      success: true,
      message: "Stock updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      offerPrice,
      category,
      taxRate,
      stock,
      expiryDate,
    } = req.body;

    const descriptionArray = description
      ? description.split('\n').filter(line => line.trim() !== '')
      : [];

    let updatedData = {
      name,
      description: descriptionArray,
      price,
      offerPrice,
      category,
      taxRate,
      stock,
      expiryDate,
    };

    // image update
    if (req.files && req.files.length > 0) {
      updatedData.image = req.files.map((file) => file.filename);
    }

    // single image support
    if (req.file) {
      updatedData.image = [req.file.filename];
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};