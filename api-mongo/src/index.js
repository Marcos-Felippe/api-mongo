let express = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 
//Pegando as rotas dos arquivos que as contém e passando o app para cada uma
require('./controllers/authController')(app);
require('./controllers/reminderController')(app);

app.listen(3000, () => {
    console.log('Sever is running in port 3000');
});