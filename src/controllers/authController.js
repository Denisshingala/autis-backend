const jwt = require('jsonwebtoken');
const user = require('../models/user');

const auth = (req, res) => {
    try {
        const { token } = req.body;
        if (token) {
            jwt.verify(token, process.env.SECRET_MESSAGE, function(err, payload) {
                if (err) {
                    return res.json({ success: 0, message: "Access is denied!" });
                }

                const { _id } = payload;

                user.findById(_id)
                    .then(userData => {
                        return res.json({ success: 1, user: userData })
                    })
                    .catch(err => {
                        return res.json({ success: 0, message: err });
                    })
            });
        } else {
            res.json({ succes: 0, error: 'Access is denied!' });
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = auth;