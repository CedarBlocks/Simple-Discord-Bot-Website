const express = require('express');
let router = express.Router();
router.use(require("express").json());

router.use(function (req, res, next) {
    console.log(req.url, "@", Date.now());
    next();
});

router.route("/").get((req, res)=> {
    res.send("<html><pre>/ip or / test you fool</pre></html>")
})

router.route("/ip").get((req, res) => {
    require("../api/ip").run(req, res);
});

router.route("/test").get((req, res) => {
    require("../api/test").run(req, res);
});


module.exports = router;