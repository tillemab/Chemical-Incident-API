const User = require('../collection/Users');

const isAdmin = async (email) => {
    try{
        const user = await User.findOne({email: email})
        return user.isAdmin;
    } catch(err) {
        console.error(err);
        return false;
    }
}

module.exports = isAdmin;