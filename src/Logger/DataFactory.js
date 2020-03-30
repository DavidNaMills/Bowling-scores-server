const defaultConfig = {
    isRaw: true,
    displayFields: ['which', 'date', 'location', 'name', 'debug', 'data']
}

module.exports = (dataToAdd, config = defaultConfig) =>{
    const tempObj = {};
    const tempFields = config.displayFields ? config.displayFields : defaultConfig.displayFields;
    const tempIsRaw = config.hasOwnProperty('isRaw') ? config.isRaw : defaultConfig.isRaw;
    tempFields.forEach(y=>{
        if (y === 'data' && dataToAdd.data) {
            if (Object.prototype.toString.call(dataToAdd.data) === '[object Object]') {
                for (let x in dataToAdd.data) {
                    tempObj[x] = dataToAdd.data[x];
                }
            } else {
                tempObj.data = dataToAdd.data;
            }
        }
        if (y === 'debug' && dataToAdd.debug) {
            for (let x in dataToAdd.debug) {
                tempObj[x] = dataToAdd.debug[x];
            }
        }else if(dataToAdd[y]){
            tempObj[y] = dataToAdd[y]
        }
    })
    return (config && tempIsRaw)
        ? tempObj
        : JSON.stringify(tempObj);
}