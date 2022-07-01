const Joi = require('joi');
const salesService = require('../services/salesService');

const salesController = {
  create: async (req, res, _next) => {
    const expected = Joi.object({
      productId: Joi.number().positive().required().messages({
        'any.required': '"productId" is required',
      }),
      quantity: Joi.number().min(1).required().messages({
        'any.required': '"quantity" is required',
        'number.min': '"quantity" must be greater than or equal to 1',
      }),
    }).required();
    const schema = Joi.array().items(expected).required().has(expected);
    const productSalesArray = await schema.validateAsync(req.body);

    await salesService.checkProduct(productSalesArray);
    const saleId = await salesService.createSale();

    const response = await salesService.createUserSale(
      saleId,
      productSalesArray,
    );
    res.status(201).json(response);
  },
};

module.exports = salesController;