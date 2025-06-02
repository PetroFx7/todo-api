const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(8080,()=>{
    console.log('Server running on port 8080');
});