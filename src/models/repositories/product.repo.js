const { productSortMapper } = require("../../configs/productService.config");
const { BadRequestErrorResponse } = require("../../core/error.response");
const { ProductStatus, productStatusValueSchema } = require("../../enums");
const { generateNullErrorMessage } = require("../../utils/string.util");
const ProductModel = require("../product.model");
const { getList } = require("./common.repo");

const Published = new ProductStatus(productStatusValueSchema.Enum.Published);

const getProducts = async ({
  filter,
  page,
  limit,
  populate,
  sort = "latest",
  select,
  unselect,
  viewFormatter,
}) => {
  return await getList({
    model: ProductModel,
    filter,
    page,
    limit,
    populate: populate || {
      path: "productSeller",
      select: "name email -_id",
    },
    sort: productSortMapper[sort],
    select,
    unselect,
    isPaging: true,
    viewFormatter,
  });
};

const findProductById = async ({ productId, optionalFilter }) => {
  if (!productId)
    throw new BadRequestErrorResponse(generateNullErrorMessage("productId"));
  let _filter = { _id: productId };
  if (optionalFilter) _filter = { ..._filter, ...optionalFilter };
  console.log("_filter: ", _filter);
  return await ProductModel.findOne(_filter);
};

const findProductByIdAndSeller = async ({ productId, productSeller }) => {
  if (!productId)
    throw new BadRequestErrorResponse(generateNullErrorMessage("productId"));
  if (!productSeller)
    throw new BadRequestErrorResponse(
      generateNullErrorMessage("productSeller")
    );

  const product = await findProductById({
    productId,
    optionalFilter: { productSeller },
  });

  return product;
};

const searchProducts = async ({
  keySearch,
  page = 1,
  limit = 50,
  viewFormatter,
}) => {
  const regexSearch = new RegExp(keySearch);
  const _page = Math.max(1, parseInt(page));
  const _limit = Math.max(1, parseInt(limit));
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

const updateProductStatus = async ({ productId, productStatusId }) => {
  const { modifiedCount } = await ProductModel.updateOne(
    { _id: productId },
    {
      $set: {
        productStatus: productStatusId,
      },
    }
  );

  return modifiedCount;
};

module.exports = {
  getProducts,
  searchProducts,
  findProductById,
  findProductByIdAndSeller,
  updateProductStatus,
};
