const router = require('express').Router();

const {
    getAnaliza,
    getAnalizaById,
    createAnaliza,
    updateAnaliza,
    deleteAnaliza,
} = require('../controllers/mongodbController')

router.get('/:limit?', getAnaliza);

router.get('/getById/:id', getAnalizaById);

router.post('/', createAnaliza);

router.put('/:id', updateAnaliza);

router.delete('/:id' , deleteAnaliza);

module.exports = router;