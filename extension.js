const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser: true});


const db = mongoose.connection;


db.on('error', (error) => {console.error(error)})

db.once('open', () => console.log('Db has been connected'))


module.exports = db;