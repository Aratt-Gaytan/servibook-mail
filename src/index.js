require('dotenv').config();
const  express =  require('express')


const indexRoutes = require( './routes/index')


const app = express()

app.use(express.json());

const port = process.env.PORT || 3000



app.get('/', (req, res) => res.send('Hello World!'))

app.use(indexRoutes);

app.listen(port, () => console.log(`Listening on port ${port}!`))