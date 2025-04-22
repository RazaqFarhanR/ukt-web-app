const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(req.user.role){
            const rolesArray = [...allowedRoles];
            const userRoles = req.user.role
            const result = rolesArray.includes(userRoles);
            if(!result) return res.sendStatus(403).send("Forbidden! You don't have permission");
            next();
        } else if (req.penguji.role){
            const rolesArray = [...allowedRoles];
            const userRoles = req.penguji.role
            const result = rolesArray.includes(userRoles);
            if(!result) return res.sendStatus(403).send("Forbidden! You don't have permission");
            next();
        } else if (req.pengurus.role){
            const rolesArray = [...allowedRoles];
            const userRoles = req.pengurus.role
            const result = rolesArray.includes(userRoles);
            if(!result) return res.sendStatus(403).send("Forbidden! You don't have permission");
            next();
        } else {
            return res.sendStatus(401);
        }  
    }
}

module.exports = verifyRoles