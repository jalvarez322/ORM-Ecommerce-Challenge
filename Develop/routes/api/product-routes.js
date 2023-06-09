const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async(req, res) => {
try { 
  const productData = await Product.findAll({
      include: [{model: Category}, {model: Tag, through: ProductTag, as : 'product_tags'}],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      includes: [{model: Category}, {model: Tag, through: ProductTag, as : 'product_tags'}],
});
if (productData) {
  res.status(404).json({ error: 404, message: 'No product found with this id!' });
  return;
}
res.status(200).json(productData);
}
catch (err) {
  res.status(500).json(err);
}
});


// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */

try {
  const productData = await Product.create(req.body);
  let resbody = {
    product: product
  }
  if (req.body.tagIds.length) {
    const productTagIdArr = req.body.tagIds.map((tag_id) => {
      return {
        product_id: product.id,
        tag_id,
      };
    });
    const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
    resBody.productTags = productTagIds;
  }
  res.status(200).json(resBody);
} catch (error) {
  res.status(400).json(error);
}
});
  
  
    
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });


// update product
router.put('/:id', async (req, res) => {
  try {
    let productData = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    

    // find all associated tags from ProductTag
    let allProductData = await ProductTag.findAll({ where: { product_id: req.params.id } });

    // get list of current tag_ids
    const productTagIds = allProductData.map(({ tag_id }) => tag_id);

    // create filtered list of new tag_ids
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      
      let destroyedTags = await ProductTag.destroy({ where: { 
        product_id : req.params.id,
        tag_id: productTagsToRemove }
       })
      let updatedProductTags = await ProductTag.bulkCreate(newProductTags)
      // console.log(updatedProductTags)
      res.status(200).json({productData : req.body, destroyedProductTags :destroyedTags, updatedProductTags : updatedProductTags});
    }
    catch (err) {
      // console.log(err);
      res.status(400).json(err);
    };
  });

router.delete('/:id', async(req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!categoryData) {
      res.status(404).json({
        message: 'No category with this id!',
        categoryData: categoryData
      });
      return;
    }
    res.status(200).json({
      message: 'Succesful deleted data',
      categoryData: categoryData
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
