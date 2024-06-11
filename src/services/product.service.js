const { productServiceConfig } = require("../configs/productService.config");
const {
  BadRequestErrorResponse,
  NotFoundErrorResponse,
} = require("../core/error.response");
const {
  ProductStatus,
  productStatusValueSchema,
  ProductType,
} = require("../enums");
const {
  formatProductResponse,
} = require("../helpers/viewFormatters/product.viewFormatter");
const {
  getProducts,
  searchProducts,
  findProductById,
  updateProductStatus,
  findProductByIdAndSeller,
} = require("../models/repositories/product.repo");
const {
  generateInvalidValueErrorMessage,
  generateNullErrorMessage,
  generateNotFoundErrorMessage,
} = require("../utils/string.util");

const Draft = new ProductStatus(productStatusValueSchema.Enum.Draft);
const Published = new ProductStatus(productStatusValueSchema.Enum.Published);
const Unpublished = new ProductStatus(
  productStatusValueSchema.Enum.Unpublished
);

// MEMO: Factory + Strategy design patterns
class ProductService {
  static productRegistry = {};

  static createProductRegistry(config) {
    this.productRegistry = { ...config };
  }

  static async createProduct(payload) {
    const {
      productName,
      productThumb,
      productPrice,
      productQuantity,
      productType: productTypeId,
      productAttributes,
    } = payload;

    if (!productName)
      throw new BadRequestErrorResponse(
        generateNullErrorMessage("productName")
      );
    if (!productThumb)
      throw new BadRequestErrorResponse(
        generateNullErrorMessage("productThumb")
      );
    if (!productPrice || productPrice < 0)
      throw new BadRequestErrorResponse(
        generateInvalidValueErrorMessage("productPrice")
      );
    if (
      productQuantity === undefined ||
      productQuantity === null ||
      productQuantity < 0
    )
      throw new BadRequestErrorResponse(
        generateInvalidValueErrorMessage("productQuantity")
      );

    if (!productTypeId || !ProductType.fromId(productTypeId).value)
      throw new BadRequestErrorResponse(
        generateInvalidValueErrorMessage("type")
      );
    if (!productAttributes)
      throw new BadRequestErrorResponse(
        generateNullErrorMessage("productAttributes")
      );

    const productClass = this.productRegistry[productTypeId];
    if (!productClass)
      throw new BadRequestErrorResponse(
        generateInvalidValueErrorMessage("type")
      );

    const newProduct = await new productClass(payload).createProduct();

    return formatProductResponse(newProduct);
  }

  static async draftProduct({ productId, productSeller }) {
    const product = await findProductByIdAndSeller({
      productId,
      productSeller,
    });

    if (!product)
      throw new NotFoundErrorResponse(generateNotFoundErrorMessage("product"));
    if (product.productStatus === Draft.id) {
      throw new BadRequestErrorResponse("This product is draft already.");
    }

    return await updateProductStatus({ productId, productStatusId: Draft.id });
  }

  static async publishProduct({ productId, productSeller }) {
    const product = await findProductByIdAndSeller({
      productId,
      productSeller,
    });

    if (!product)
      throw new NotFoundErrorResponse(generateNotFoundErrorMessage("product"));
    if (product.productStatus === Published.id) {
      throw new BadRequestErrorResponse("This product is already published.");
    }

    return await updateProductStatus({
      productId,
      productStatusId: Published.id,
    });
  }

  static async unpublishProduct({ productId, productSeller }) {
    const product = await findProductByIdAndSeller({
      productId,
      productSeller,
    });

    if (!product)
      throw new NotFoundErrorResponse(generateNotFoundErrorMessage("product"));
    if (product.productStatus === Unpublished.id) {
      throw new BadRequestErrorResponse("This product is already unpublished.");
    }
    if (product.productStatus === Draft.id) {
      throw new BadRequestErrorResponse(
        "You can not unpublish a draft product."
      );
    }

    return await updateProductStatus({
      productId,
      productStatusId: Unpublished.id,
    });
  }

  static async getDraftProductsBySeller({
    productSeller,
    limit = 50,
    page = 1,
  }) {
    const filter = {
      productSeller,
      productStatus: Draft.id,
    };
    return await getProducts({
      filter,
      limit,
      page,
      viewFormatter: formatProductResponse,
    });
  }

  static async getPublishedProductsBySeller({
    productSeller,
    limit = 50,
    page = 1,
  }) {
    const filter = {
      productSeller,
      productStatus: Published.id,
    };

    return await getProducts({
      filter,
      limit,
      page,
      viewFormatter: formatProductResponse,
    });
  }

  static async getUnpublishedProductsBySeller({
    productSeller,
    limit = 50,
    page = 1,
  }) {
    const filter = {
      productSeller,
      productStatus: Unpublished.id,
    };

    return await getProducts({
      filter,
      limit,
      page,
      viewFormatter: formatProductResponse,
    });
  }

  static async getProductBySeller({ productId, productSeller }) {
    const product = await findProductByIdAndSeller({
      productId,
      productSeller,
    });
    if (!product)
      throw new NotFoundErrorResponse(generateNotFoundErrorMessage("product"));
    return formatProductResponse(product);
  }

  static async getProducts({
    filter,
    limit,
    page,
    sort,
    select = "productName, productThumb, productPrice",
  }) {
    const _filter = {
      ...global.parseJSON(filter),
      productStatus: Published.id,
    };
    return await getProducts({
      filter: _filter,
      limit,
      page,
      populate: {
        path: "productSeller",
        select: "_id name",
      },
      sort,
      select,
      viewFormatter: formatProductResponse,
    });
  }

  static async getProduct(productId) {
    const product = await findProductById({
      productId,
      optionalFilter: { productStatus: Published.id },
    });
    if (!product)
      throw new NotFoundErrorResponse(generateNotFoundErrorMessage("product"));
    return formatProductResponse(product);
  }

  static async searchProducts({ keySearch, limit, page }) {
    return await searchProducts({
      keySearch,
      limit,
      page,
      viewFormatter: formatProductResponse,
    });
  }
}

ProductService.createProductRegistry(productServiceConfig);

module.exports = ProductService;
