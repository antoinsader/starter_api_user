
  const role = (requiredRole) => {
      return (req, res, next) => {
        if (req.user.role.toUpperCase() != requiredRole.toUpperCase()) {
          return res.status(403).send({ error: 'Access denied' });
        }
        next();
      };
    };
    
    module.exports = role;
    