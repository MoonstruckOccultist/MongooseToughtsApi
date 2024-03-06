const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req, res) => res.send('ERROR: INCORECT ROUTE'));

module.exports = router;
