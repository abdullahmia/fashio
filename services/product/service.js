import { deleteImageFromCloudinary } from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import { ZId, ZSlug } from "@/types/common";
import { ZCreateProduct, ZUpdateProduct } from "@/types/product";
import { cache } from "@/utils/cache";
import { replaceMeta, transformObject } from "@/utils/convert-data";
import { extractPublicId } from "@/utils/file";
import { validateInputs } from "@/utils/validate";
import { cache as reactCache } from "react";
import "server-only";
import { Category } from "../category/category.model";
import { Order } from "../order/order.model";
import { productCache } from "./cache";
import { Product } from "./product.model";

// export const getProducts = reactCache(() =>
//   cache(
//     async () => {
//       await connectDB();
//       return transformObject(
//         await Product.find({})
//           .populate({
//             path: "category",
//             model: Category,
//           })
//           .sort({ createdAt: -1 })
//           .lean()
//       );
//     },
//     [productCache.tag.byCount()],
//     {
//       tags: [productCache.tag.byCount()],
//     }
//   )()
// );

export const getProducts = reactCache(() =>
  cache(
    async () => {
      await connectDB();
      return transformObject(
        await Product.find({})
          .populate({
            path: "category",
            model: Category,
          })
          .sort({ createdAt: -1 })
          .lean()
      );
    },
    [productCache.tag.byCount()],
    {
      tags: [productCache.tag.byCount()],
    }
  )()
);

export const getShopProducts = async (page, limit = 10) => {
  try {
    await connectDB();
    const products = await Product.find({})
      .populate({
        path: "category",
        model: Category,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const data = {
      products: products,
      total: await Product.countDocuments(),
      page: page,
      limit: limit,
      totalPages: Math.ceil((await Product.countDocuments()) / limit),
    };
    return replaceMeta(data);
  } catch (error) {
    throw new Error("Failed to get products");
  }
};

export const getProductById = reactCache((id) =>
  cache(
    async () => {
      validateInputs([id, ZId]);

      try {
        await connectDB();
        const product = await Product.findOne({ _id: id })
          .populate({
            path: "category",
            model: Category,
          })
          .lean();
        return transformObject(product);
      } catch (error) {
        throw new Error("Failed to get product");
      }
    },
    [productCache.tag.byId(id)],
    {
      tags: [productCache.tag.byId(id)],
    }
  )()
);

export const getProductBySlug = reactCache((slug) =>
  cache(
    async () => {
      validateInputs([slug, ZSlug]);

      try {
        await connectDB();
        const product = await Product.findOne({ slug: slug })
          .populate({
            path: "category",
            model: Category,
          })
          .lean();
        if (!product) {
          throw new Error("Product not found");
        }
        return transformObject(product);
      } catch (error) {
        console.log(error);
        throw new Error(error?.message);
      }
    },
    [productCache.tag.bySlug(slug)],
    {
      tags: [productCache.tag.bySlug(slug)],
    }
  )()
);

export const addProduct = async (data) => {
  validateInputs([data, ZCreateProduct]);

  try {
    await Product.create(data);

    productCache.revalidate({ count: true });
  } catch (error) {
    throw new Error(error?.message);
  }
};

export const deleteProduct = async (id) => {
  validateInputs([id, ZId]);

  try {
    const product = await Product.findByIdAndDelete(id);

    // delete the images from the cloudinary
    product?.images?.map(async (image) => {
      const publicId = extractPublicId(image?.url);
      // delete the image from cloudinary
      await deleteImageFromCloudinary(publicId);
    });

    productCache.revalidate({ count: true });
  } catch (error) {
    throw new Error(error?.message);
  }
};

export const updateProduct = async (id, data) => {
  validateInputs([id, ZId], [data, ZUpdateProduct]);

  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    // dalete the deletedImages from the data
    const deletedImages = data.deletedImages;
    if (deletedImages?.length > 0) {
      const deletedImagesIds = deletedImages.map((image) => image.id);
      // delete the images from the cloudinary
      deletedImages?.map(async (image) => {
        const publicId = extractPublicId(image?.url);
        // delete the image from cloudinary
        await deleteImageFromCloudinary(publicId);
      });

      await Product.updateOne(
        { _id: id },
        {
          $pull: {
            images: {
              _id: {
                $in: deletedImagesIds,
              },
            },
          },
        }
      );
    }

    delete data.deletedImages;

    product.title = data.title;
    product.price = data.price;
    product.category = data.category;
    product.sku = data.sku;
    product.stockStatus = product.stockStatus;
    product.description = data.description;
    product.availableQuantity = data.availableQuantity;
    product.size = data.size;
    product.images = data.images;
    product.slug = product.slug;

    await product.save();

    productCache.revalidate({ id: id, count: true });
  } catch (error) {
    throw new Error(error?.message);
  }
};

export async function getBestSellingProducts(limit = 4) {
  try {
    const bestSellingProducts = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalQuantity: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.category",
          foreignField: "_id",
          as: "productDetails.categoryDetails",
        },
      },
      { $unwind: "$productDetails.categoryDetails" },
      {
        $project: {
          _id: 0,
          productDetails: 1,
          totalQuantity: 1,
        },
      },
    ]);

    bestSellingProducts.map((item) => {
      item.productDetails.category = item.productDetails.categoryDetails;
      delete item.productDetails.categoryDetails;
      return item;
    });

    return replaceMeta(bestSellingProducts.map((item) => item.productDetails));
  } catch (error) {
    return [];
  }
}
