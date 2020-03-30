
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    default: '',
    font: {
        '1': '\x1b[31m',
        '2': '\x1b[33m',
        '3': '\x1b[35m',
        '4': '\x1b[34m'
    },
    debug: "\x1b[36m"
}

const msg = {
    '1': 'ERROR',
    '2': 'WARNING',
    '3': 'INFO',
    '4': 'DEV'
}



class StringClass {
    constructor(injectDate){
        this.createDateString = injectDate;
    }

    buildString(data, displayConfig=null){
        const typ = typeof (data);
        if (typ === 'object' && (!displayConfig || displayConfig.length === 0)) {
            return JSON.stringify(data);
        } else if (typ === 'object' && displayConfig) {
            let newStr = {};
            displayConfig.forEach(x => {
                if (data[x]) {
                    newStr[x] = data[x];
                } else {
                    newStr[x] = `VALUE MISSING`
                }
            })
            return JSON.stringify(newStr);
        } else {
            return `${data}`;
        }
    }


    stringFormatter(tempConfig, which, debug, fullStr){
        const str = [];
        if (tempConfig.colors) {
            str.push(colors.bright);
            str.push(colors.font[`${which}`]);
        }
    
        str.push(msg[`${which}`]);
    
        if (tempConfig.name) {
            str.push(`<${tempConfig.name}>`);
        }
    
        if (tempConfig.showDate) {
            str.push(`${this.createDateString()}`);
        }
    
        if (tempConfig.colors) {
            str.push(colors.reset);
        }
    
        if (tempConfig.isDebug && tempConfig.isDebug.on) {
            if (tempConfig.isDebug.onlyLevel && tempConfig.isDebug.onlyLevel === which) {
                str.push(tempConfig.colors ? `${colors.debug}${debug.functionName}: ${debug.lineNumber}${colors.reset}` :  `${debug.functionName}: ${debug.lineNumber}`);
    
            } else if (tempConfig.isDebug.level && tempConfig.isDebug.level >= which) {
                str.push(tempConfig.colors ? `${colors.debug}${debug.functionName}: ${debug.lineNumber}${colors.reset}` : `${debug.functionName}: ${debug.lineNumber}`);
            }
        }
    
        str.push('\t');
        str.push(fullStr);
        const strComp = str.join(' ');
        return strComp;
    }


}

module.exports = StringClass;