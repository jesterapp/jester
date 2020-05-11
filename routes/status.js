var express = require('express');
var router = express.Router();

// Get list of status updates about your team
router.get('/:team', (req, res) => {
    console.log('getting status:'+req.params.team);
    res.json({'team':req.params.team, 'updates':[]});
    res.status(200);
});

// Post a status update to your team
router.post('/:team', (req, res) => {

});

module.exports = router;
