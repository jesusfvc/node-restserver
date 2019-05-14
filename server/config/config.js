


//======================
// Puerto
//======================

process.env.PORT = process.env.PORT || 3000;


//======================
// Entorno
//======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//======================
// Vencimiento
//======================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//======================
// SEED
//======================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//======================
// base de datos
//======================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.mongouri;
}

process.env.urlDB = urlDB;

//======================
// Cliente ID
//======================
process.env.CLIENT_ID = process.env.CLIENT_ID || "943205252931-cajlq84nr7nn6nondo03qti4udikt4mh.apps.googleusercontent.com"