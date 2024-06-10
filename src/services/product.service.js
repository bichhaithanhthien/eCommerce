const { productServiceConfig } = require("../configs/productService.config");
const { BadRequestErrorResponse } = require("../core/error.response");
const {
  ProductStatus,
  productStatusValueSchema,
  ProductType,
} = require("../enums");
const {
  formatProductResponse,
} = require("../helpers/viewFormatters/product.viewFormatter");
const {
  publishProduct,
  findProductsBySeller,
  draftProduct,
  unpublishProduct,
  searchProducts,
} = require("../models/repositories/product.repo");
const {
  generateInvalidValueErrorMessage,
  generateNullErrorMessage,
} = require("../utils/string.util");

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
    return await draftProduct({ productId, productSeller });
  }

  static async publishProduct({ productId, productSeller }) {
    return await publishProduct({ productId, productSeller });
  }

  static async unpublishProduct({ productId, productSeller }) {
    return await unpublishProduct({ productId, productSeller });
  }

  static async getDraftProductsBySeller({
    productSeller,
    limit = 50,
    page = 1,
  }) {
    const filter = {
      productSeller,
      productStatus: new ProductStatus(productStatusValueSchema.Enum.Draft).id,
    };
    return await findProductsBySeller({
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
      productStatus: new ProductStatus(productStatusValueSchema.Enum.Published)
        .id,
    };

    return await findProductsBySeller({
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
      productStatus: new ProductStatus(productStatusValueSchema.Enum.Unpublished)
        .id,
    };

    return await findProductsBySeller({
      filter,
      limit,
      page,
      viewFormatter: formatProductResponse,
    });
  }

  static async searchProducts({ keySearch, limit = 50, page = 1 }) {
    return await searchProducts({ keySearch, limit, page, viewFormatter: formatProductResponse, });
  }
}

ProductService.createProductRegistry(productServiceConfig);

module.exports = ProductService;
