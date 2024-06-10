"use strict";
const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const {
  generateCreatedSuccessMessage,
  generateGetListSuccessMessage,
} = require("../utils/string.util");

class ProductController {
  createProduct = async (req, res) => {
    new SuccessResponse({
      message: generateCreatedSuccessMessage("a new product"),
      metadata: await ProductService.createProduct({
        productName: req.body.productName,
        productThumb: req.body.productThumb,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        productQuantity: req.body.productQuantity,
        productType: req.body.productType,
        productAttributes: req.body.productAttributes,
        productStatus: req.body.productStatus,
        productSeller: req.user.userId,
      }),
    }).send(res);
  };

  draftProduct = async (req, res) => {
    new SuccessResponse({
      message: `Drafted the product (_id: ${req.params.id}) successfully.`,
      metadata: await ProductService.draftProduct({
        productId: req.params.id,
        productSeller: req.user.userId,
      }),
    }).send(res);
  };

  publishProduct = async (req, res) => {
    new SuccessResponse({
      message: `Published the product (_id: ${req.params.id}) successfully.`,
      metadata: await ProductService.publishProduct({
        productId: req.params.id,
        productSeller: req.user.userId,
      }),
    }).send(res);
  };

  unpublishProduct = async (req, res) => {
    new SuccessResponse({
      message: `Unpublished the product (_id: ${req.params.id}) successfully.`,
      metadata: await ProductService.unpublishProduct({
        productId: req.params.id,
        productSeller: req.user.userId,
      }),
    }).send(res);
  };

  getDraftProductsBySeller = async (req, res) => {
    new SuccessResponse({
      message: generateGetListSuccessMessage("draft product"),
      metadata: await ProductService.getDraftProductsBySeller({
        productSeller: req.user.userId,
        limit: req.query.limit,
        page: req.query.page,
      }),
    }).send(res);
  };

  getPublishedProductsBySeller = async (req, res) => {
    new SuccessResponse({
      message: generateGetListSuccessMessage("published product"),
      metadata: await ProductService.getPublishedProductsBySeller({
        productSeller: req.user.userId,
        limit: req.query.limit,
        page: req.query.page,
      }),
    }).send(res);
  };

  getUnpublishedProductsBySeller = async (req, res) => {
    new SuccessResponse({
      message: generateGetListSuccessMessage("unpublished product"),
      metadata: await ProductService.getUnpublishedProductsBySeller({
        productSeller: req.user.userId,
        limit: req.query.limit,
        page: req.query.page,
      }),
    }).send(res);
  };

  searchProducts = async (req, res) => {
    new SuccessResponse({
      message: generateGetListSuccessMessage("product"),
      metadata: await ProductService.searchProducts({
        keySearch: req.params.keySearch,
        limit: req.body.limit,
        page: req.body.page,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
