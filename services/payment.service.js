/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: services/payment.service.js
 * VERSION: v9.0.0
 * STATUS: production
 * LAST FIX: unified payment dispatcher
 */

const config = require("../config/payment.config");
const omiseService = require("./omise.service");
const scbService = require("./scb.service");
const cryptoService = require("./crypto.service");

async function createPayment(method, product, user){

  if(!config.PRODUCTS[product]){
    throw new Error("INVALID_PRODUCT");
  }

  const productData = config.PRODUCTS[product];

  switch(method){

    case "omise":
      return await omiseService.createCharge(productData, user);

    case "truemoney":
      return await omiseService.createTrueMoney(productData, user);

    case "scb":
      return await scbService.createQR(productData, user);

    case "crypto":
      return await cryptoService.createOrder(productData, user);

    default:
      throw new Error("INVALID_METHOD");
  }
}

module.exports = { createPayment };
