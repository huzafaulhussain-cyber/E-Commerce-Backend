const app = require('.');

const { connectdb } = require('./config/db');
connectdb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server is connected now : ', PORT);
});