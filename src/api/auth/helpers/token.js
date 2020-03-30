const jwt = require ('jsonwebtoken');
const config = require ( '../../../config/index.js');


const generateToken = (user) => {
    const data = {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        color: user.color,
        location: user.location,
        friends: user.friends,
        privateEvents: user.privateEvents,
        showMsg: user.showMsg
    };

    return jwt.sign({data}, config.signature, { expiresIn: '7h' });
}


const verifyToken = (token) =>{
    const x = jwt.verify(token, config.signature, function(err, ver) {
        if(err){
            return false;
        } else {
            return true;
        }
      });
      return x;
}

const decodeToken = (token) => {
    var decoded = jwt.decode(token, {complete: true});
    return decoded.payload.data;
}

module.exports ={
    generateToken,
    verifyToken,
    decodeToken
}