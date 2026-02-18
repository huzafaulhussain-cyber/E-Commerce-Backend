const app = require('.');

const { connectdb } = require('./config/db');
connectdb();

const port =3000;
app.listen(port,()=>{
    console.log('Server is connected now : ',port);
    
})