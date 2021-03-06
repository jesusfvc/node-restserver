
const express = require('express')
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

const { verificarToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express()

app.get('/usuarios', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email rol estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            })
        });
})

app.post('/usuarios', [verificarToken, verificaAdmin_Role], function (req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        rol: body.rol
    });


    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

    // if (body.nombre === undefined) {

    //     res.status(400).json({
    //         ok: false,
    //         mensaje: "El nombre es necesario"
    //     });
    // } else {
    //     res.json({
    //         persona: body
    //     });
    // }
});

app.put('/usuarios/:id', [verificarToken, verificaAdmin_Role], function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']);


    // delete body.password;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDb) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDb
        })
    });

})

app.delete('/usuarios/:id', [verificarToken, verificaAdmin_Role], function (req, res) {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario no encontrado'
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    })
})

module.exports = app;