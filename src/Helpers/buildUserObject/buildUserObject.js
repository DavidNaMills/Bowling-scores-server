const buildUserObject = (user) =>{
    const temp = {
        username: user.username,
        thirdPartyId: user.thirdPartyId,
        avatar: user.avatar,
        color: user.color,
        location: user.location,
        games: user.games,
        showMsg: user.showMsg,
        _id: user._id,
        name: user.name,
        friends: user.friends,
        privateEvents: user.privateEvents,
        statistics: user.statistics
    }
    return temp;
}

module.exports = buildUserObject;