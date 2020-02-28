const handleNoRoute = async (ctx, next) => {
    try {
        await next();
        const status = ctx.status || 404;
        if (status === 404) {
            ctx.throw(404);
        }
    } catch (err) {
        ctx.status = err.status || 500;
        if (ctx.status === 404) {
            //Your 404.jade
            ctx.body = "Pas d'index'";
        } else {
            //other_error jade
            ctx.body = "Erreur serveur";
        }
    }
};

module.exports = handleNoRoute;