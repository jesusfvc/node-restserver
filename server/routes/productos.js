const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

//============
//obtener productos
//============
app.get('/productos', verificarToken, (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    let desde = req.params.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde).limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        })
});

//============
//obtener un producto por ID
//============  
app.get('/productos/:id', (req, res) => {
    //populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        });
});

//============
// Buscar productos
//============
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productos) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Termino no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productos
            })
        })
})

//============
//crear un producto
//============  
app.post('/productos', verificarToken, (req, res) => {
    //populate: usuario categoria
    //usuario categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});

//============
//actualizar un producto por ID
//============  
app.put('/productos/:id', verificarToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });

        });

    });

});

//============
//borrar un producto por ID
//============  
app.delete('/productos/:id', verificarToken, (req, res) => {
    //populate: usuario categoria

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            })

        })

    });

});

module.exports = app;