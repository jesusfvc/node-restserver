const jwt = require('jsonwebtoken');

//=================
// Verificar token
//=================

let verificarToken = (req, res, next) => {

    let token = req.get('token');

    // res.json({
    //     token: token
    // });

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

//=================
// Verificar AdminRole
//=================

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.rol === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })

    }

}
module.exports = {
    verificarToken,
    verificaAdmin_Role
}