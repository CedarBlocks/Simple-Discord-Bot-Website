const express = require('express');
let router = express.Router();
router.use(require("express").json());

router.use(function (req, res, next) {
    console.log(req.url, "@", Date.now());
    next();
});

router.route("/").get((req, res)=> {
    require("../api/index.js").run(req, res);
})

router.route("/logo").get((req, res) => {
    require("../api/logo.js").run(req, res);
});

router.route("/status").get((req, res) => {
    require("../api/status.js").run(req, res);
});

router.route("/stats").get((req, res) => {
    require("../api/status.js").run(req, res);
});


module.exports = router;