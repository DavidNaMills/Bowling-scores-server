const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;

const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

beforeEach(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  await mongoose.connect(mongoUri, opts, (err) => {
    if (err) console.error(err);
  });
});

// afterEach(async () => {
//   await mongoose.disconnect();
//   await mongoServer.stop();
// });