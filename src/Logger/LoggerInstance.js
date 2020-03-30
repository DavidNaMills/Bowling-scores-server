const ERROR = 1;
const WARNING = 2;
const INFO = 3;
const DEV = 4;


class Logger {
    constructor(dateClass, stringClass, dataFactory=null){
        this.dateClass = dateClass;
        this.stringClass = stringClass;
        this.dataFactory = dataFactory;
        this.config = [];
        this.level = 3;
        this.location = null;
        this.debug = {
            functionName: null,
            lineNumber: null
        }
    }

    // own class?
    _log(data, which) {     // remove from class?   pass this.config into here
        if (this.level >= which) {
            this.config.forEach(conf => {
                const tempLevel = conf.onlyLevel ? conf.onlyLevel : which;

                if (tempLevel == which) {
                    switch (conf.type.toLowerCase()) {
                        case 'console':     // write to console
                            this._console(data, which, conf);
                            break;
                        case 'function':    // other method
                            const compiledData = this.dataFactory({
                                which, 
                                date: this.dateClass.createDateString(),
                                debug: this.debug,
                                data,
                                location: this.location
                            }, conf.fieldConfig);
                            this._function(compiledData, conf.func, conf.options);
                            break;
                        default:
                            console.error('Invalid method type: [console, function]');
                            break
                    }
                } // end of if
            })  // end of forEach
        }
    }


    _console(data, which, tempConfig) { 
        const fullStr = this.stringClass.buildString(data, tempConfig.displaySchema);
        const strComp = this.stringClass.stringFormatter(tempConfig, which, this.debug, fullStr);
        
        switch (which) {
            case ERROR:
                console.error(strComp);
                break;
            case WARNING:
                console.warn(strComp);
                break;
            case INFO:
                console.info(strComp);
                break;
            case DEV:
                console.log(strComp);
                break;
            default:
                break
        }
    }





    configLogger(config, location=null) {
        this.config = config.methods;
        this.level = config.level ? config.level : 3;
        this.location = location;
    }

    error(message) {
        const e = new Error();
        const frame = e.stack.split("\n")[2];
        let lineNumber = `${frame.split(":")[2]}:${frame.split(":")[3]}`;
        this.debug.functionName = frame.split(":")[1];
        this.debug.lineNumber = lineNumber.split(")")[0];
        this._log(message, ERROR);
    }

    warning(message) {
        this.debug = {
            functionName: null,
            lineNumber: null
        };

        if (this.level >= WARNING) {
            const e = new Error();
            const frame = e.stack.split("\n")[2];
            let lineNumber = `${frame.split(":")[2]}:${frame.split(":")[3]}`;
            this.debug.functionName = frame.split(":")[1];
            this.debug.lineNumber = lineNumber.split(")")[0];
            this._log(message, WARNING);
        }
    }

    dev(message) {
        this.debug = {
            functionName: null,
            lineNumber: null
        };

        if (this.level === DEV) {
            const e = new Error();
            const frame = e.stack.split("\n")[2];
            let lineNumber = `${frame.split(":")[2]}:${frame.split(":")[3]}`;
            this.debug.functionName = frame.split(":")[1];
            this.debug.lineNumber = lineNumber.split(")")[0];
            this._log(message, DEV);
        }
    }

    info(message) {
        this.debug = {
            functionName: null,
            lineNumber: null
        };

        if (this.level >= INFO) {
            const e = new Error();
            const frame = e.stack.split("\n")[2];
            let lineNumber = `${frame.split(":")[2]}:${frame.split(":")[3]}`;
            this.debug.functionName = frame.split(":")[1];
            this.debug.lineNumber = lineNumber.split(")")[0];
            this._log(message, INFO);
        }
    }

    _function(data, func, options = null) { //remove from class?
        try {
            func(data, options);
        } catch (err) {
            console.log(err);
            this._console(err, ERROR, true)
        }
    }

}




module.exports = Logger;