const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use("/auth", require('./routes/jwtAuth'));

app.use("/dashboard", require('./routes/dashboard'));
app.listen(5001, ()=>{
    console.log('Server 2 is running on port 5001');
});