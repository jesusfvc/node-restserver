


//======================
// Puerto
//======================

process.env.PORT = process.env.PORT || 3000;


//======================
// Entorno
//======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//======================
// base de datos
//======================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://jesus:20021995@clusternode-4izo1.mongodb.net/cafe?retryWrites=true';
}

process.env.urlDB = urlDB;