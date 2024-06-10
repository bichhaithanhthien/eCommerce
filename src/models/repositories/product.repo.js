const {
  NotFoundErrorResponse,
  BadRequestErrorResponse,
} = require("../../core/error.response");
const { ProductStatus, productStatusValueSchema } = require("../../enums");
const { generateNotFoundErrorMessage } = require("../../utils/string.util");
const ProductModel = require("../product.model");
const { getList } = require("./common.repo");

const Draft = new ProductStatus(productStatusValueSchema.Enum.Draft);
const Published = new ProductStatus(productStatusValueSchema.Enum.Published);
const Unpublished = new ProductStatus(
  productStatusValueSchema.Enum.Unpublished
);

const findProductsBySeller = async ({ filter, page, limit, viewFormatter }) => {
  return await getList({
    model: ProductModel,
    filter,
    page,
    limit,
    populate: {
      path: "productSeller",
      select: "name email -_id",
    },
    sort: "{ updateAt: -1 }",
    isPaging: true,
    viewFormatter,
  });
};

const findProductByIdandSeller = async ({ productId, productSeller }) => {
  return await ProductModel.findOne({
    _id: productId,
    productSeller: productSeller,
  });
};

const searchProducts = async ({ keySearch, page, limit, viewFormatter }) => {
  const regexSearch = new RegExp(keySearch);
  const _page = Math.max(1, parseInt(page || 1));
  const _limit = Math.max(1, parseInt(limit || 50));
  const skip = (_page - 1) * _limit;

  const docs = await ProductModel.find(
    {
      productStatus: Published.id,
      $text: { $search: regexSearch },
    },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .skip(skip)
    .limit(_limit)
    .lean();

  const total = await ProductModel.countDocuments(
    {
      $text: { $search: regexSearch },
    },
    { score: { $meta: "textScore" } }
  );
  const lastPage = Math.ceil(total / _limit);

  return {
    total,
    page: _page > lastPage ? lastPage : _page,
    limit: _limit,
    lastPage,
    docs: viewFormatter ? docs.map((record) => viewFormatter(record)) : docs,
  };
};

const draftProduct = async ({ productId, productSeller }) => {
  const product = await findProductByIdandSeller({ productId, productSeller });

  if (!product)
    throw new NotFoundErrorResponse(generateNotFoundErrorMessage("product"));
  if (product.productStatus === Draft.id) {
    throw new BadRequestErrorResponse("This product is draft already.");
  }

  const { modifiedCount } = await ProductModel.updateOne(
    { _id: product._id },
    {
      $set: {
        productStatus: Draft.id,
      },
    }
  );

  return modifiedCount;
};

const publishProduct = async ({ productId, productSeller }) => {
  const product = await findProductByIdandSeller({ productId, productSeller });

  if (!product)
    throw new NotFoundErrorResponse(generateNotFoundErrorMessage("product"));
  if (product.productStatus === Published.id) {
    throw new BadRequestErrorResponse("This product is already published.");
  }

  const { modifiedCount } = await ProductModel.updateOne(
    { _id: product._id },
    {
      $set: {
        productStatus: Published.id,
      },
    }
  );

  return modifiedCount;
};

const unpublishProduct = async ({ productId, productSeller }) => {
  const product = await findProductByIdandSeller({ productId, productSeller });

  if (!product)
    throw new NotFoundErrorResponse(generateNotFoundErrorMessage("product"));
  if (product.productStatus === Unpublished.id) {
    throw new BadRequestErrorResponse("This product is already unpublished.");
  }
  if (product.productStatus === Draft.id) {
    throw new BadRequestErrorResponse("You can not unpublish a draft product.");
  }

  const { modifiedCount } = await ProductModel.updateOne(
    { _id: product._id },
    {
      $set: {
        productStatus: Unpublished.id,
      },
    }
  );

  return modifiedCount;
};

module.exports = {
  findProductsBySeller,
  searchProducts,
  draftProduct,
  publishProduct,
  unpublishProduct,
};
