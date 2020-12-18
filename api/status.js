const fetch = require('node-fetch')
module.exports = {
    run: async function (req, res) {
        fetch(require('../config.json').botServer)
            .then(res => res.json())
            .then(json => {
                return res.status(200).json(json);
            });
    }
}