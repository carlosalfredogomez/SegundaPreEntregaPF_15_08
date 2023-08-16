const express = require('express');
const handlebars = require('express-handlebars');
const handleSocketConnection = require('./utils/socketHandlebars')
const mongoose = require('mongoose');
const { Server } = require('socket.io')


const multer = require('multer');

const app = express()
const MONGODB_CONNECT = `mongodb+srv://carlosalfredogomez:MongoAtlas423@ecommerce.d3n3mjn.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(MONGODB_CONNECT)
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch((error) => {
    if (error) {
      console.log('Error al conectarse a la base de datos', error.message)
    }
  })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/img');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const uploader = multer({ storage: storage });

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');


const httpServer = app.listen(8080, () => {
  console.log(`Servidor express escuchando en el puerto 8080`);
});
const io = new Server(httpServer)
handleSocketConnection(io)

const productsRouter = require('./routers/productsRouter');
const cartsRouter = require('./routers/cartsRouter');
const viewsRouter = require('./routers/viewsRouter');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

app.get('/healthCheck', (req, res) => {
    res.json({
        status: 'running',
        date: new Date(),
    });
});

module.exports = io