const express = require('express');

let { verificarToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//===============
//mostrar todas las categorias
//===============
app.get('/categoria', verificarToken, (req, res) => {
    //Categoria.findById();
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            })
        });
});


//===============
//mostrar las categorias por id
//===============
app.get('/categoria/:id', verificarToken, (req, res) => {
    //Categoria.findById();

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es valido'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});



//===============
//crear nueva categorias
//===============
app.post('/categoria', verificarToken, (req, res) => {
    //req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });



    })

});


//===============
//actualizar descripcion de categoria
//===============
app.put('/categoria/:id', verificarToken, (req, res) => {
    //req.usuario._id
    let id = req.params.id;
    let body = req.body;


    let descCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

//===============
//borrar categoria categorias
//===============
app.delete('/categoria/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    //solo un admin
    //pedir token
    //Categoria.findbyidandremove
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        })


    });
});


module.exports = app;