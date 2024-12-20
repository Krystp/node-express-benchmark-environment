const express = require('express')
require('./connectors/mongodbCon')

const { connectionPg } = require('./connectors/postgresCon'); 

const app = express()
const port = 3000

app.use(express.json())

const analizaRouter = require('./routes/mongodbRoutes');
app.use('/mongodb', analizaRouter);

const postgresRouter = require('./routes/postgresRoutes');
app.use('/postgres', postgresRouter);

connectionPg();

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
