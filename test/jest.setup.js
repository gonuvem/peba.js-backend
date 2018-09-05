const mongoose = require('mongoose');

jest.setTimeout(30000);
beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
});

afterAll(async () => {
    await mongoose.disconnect();
});