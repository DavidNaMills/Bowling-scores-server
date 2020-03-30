

class DateClass {
    constructor(){}

    createDateString(){
        return new Date().toLocaleDateString("en-GB", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
    }

    setDate(data){    // remove from class?
        return typeof (data) === 'object'
            ? { date: this.createDateString(), ...data }
            : `${this.createDateString()}:  ${data}`
    }
}

module.exports = DateClass;