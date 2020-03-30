const mongoose = require('mongoose');
const MockMongoose = require('mock-mongoose').MockMongoose;
const mockgoose = new MockMongoose(mongoose);


beforeAll(()=>{
    mongoose.disconnect();
})

beforeAll(function(done) {
    mockgoose.helper.setDbVersion("3.3.2");

    mockgoose.prepareStorage().then(function() {
        mongoose.connect(`mongodb://test.com/${process.env.TEST_SUITE}`, {useNewUrlParser: true});
        mongoose.connection.on('connected', (err) => {
            done(err);
        });
    });
});

afterEach(function(done) {
    mockgoose.helper.reset().then(() => {
        done();
    });
});

afterAll(()=>{
    mongoose.disconnect();
})

module.exports = mockgoose;