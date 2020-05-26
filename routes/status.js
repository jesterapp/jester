const express = require('express');
const router = express.Router();
const LocalStorage = require('node-localstorage').LocalStorage;
const portscanner = require('portscanner')
localStorage = new LocalStorage('./status');

// Get list of status updates about your team
router.get('/:team/:name', (req, res) => {
    let itm = req.params.team + "_" + req.params.name + ".json";
    let status = localStorage.getItem(itm);
    let respObj = {'success':true};
    if (status) {
        respObj.status = JSON.parse(status);
    }
    res.status(200);
    res.json(respObj);
});

// Post a status update to your team
router.post('/', (req, res) => {
    let team = req.body.team;
    let name = req.body.name;
    let itm = team + "_" + name + ".json";
    localStorage.setItem(itm, JSON.stringify(req.body));
    res.status(200);
    res.json({"success":true});
});

router.get('/others', (req, res) => {
    res.status(200);
    res.json({"users": [
        {"name":"user1", "team":"team1", "yesterday":"Yester", "today":"tod", "blockers":"None"},
        {"name":"user2", "team":"team2", "yesterday":"Yester2", "today":"tod2", "blockers":"None2"}
    ]})
});

module.exports = router;
