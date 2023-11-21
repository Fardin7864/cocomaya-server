
const verifyAdmin = async (req, res, next) => {
    const email = req.user.email;
    // console.log(email)
    const query = { email: email };
    console.log(query);
    const user = await userColl.findOne(query);
    // console.log("this is from middle:",user)
    const isAdmin = user?.role === "admin";
    console.log(isAdmin);
    if (!isAdmin) {
      return res.status(403).send({ message: "Forbidden!" });
    }
    next();
  };

module.exports = verifyAdmin;