const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    let tagData = await Tag.findAll(
      {
        include: [{
          model: Product,
          through: ProductTag,
          as: 'tagged_products'
        }]
      })
    if (!tagData) {
      res.status(404).json({
        err: 404,
        message: "Couldn't find products"
      })
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err)
  }
});

router.get('/:id', async (req, res) => {
  try {
    let tagData = await Tag.findByPk(req.params.id,
      {
        include: [{
          model: Product,
          through: ProductTag,
          as: 'tagged_products'
        }]
      })
    if (!tagData) {
      res.status(404).json({
        err: 404,
        message: "Couldn't find products"
      })
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err)
  }
});

router.post('/', async (req, res) => {
  try {
    let tagData = await Tag.create(req.body)

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err)
  }
});

router.put('/:id', async (req, res) => {
  try {
    let tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    if (!tagData[0]) {
      res.status(400).json({
        message: 'Could not update, id does not exist or it is already that value',
        tagData: tagData
      });
      return;
    }


    res.status(200).json({ message: "Successfully updated tag", tagData: tagData });
  } catch (err) {
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    })
    if (!tagData) {
      res.status(404).json({
        message: 'ID does not exist',
        tagData: tagData
      });
      return;
    }

    res.status(200).json({ message: "Successfully deleted tag", tagData: tagData });
  } catch (err) {
    res.status(500).json({ message: "Could not delete tag" })
  }
});

module.exports = router;
