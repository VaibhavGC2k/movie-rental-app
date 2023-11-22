const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const verifyToken = (req, res, next) => {
  cookieParser()(req, res, () => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).send({ success: false, message: "Access Denied!" });
    }
    try {
      const decode = jwt.verify(token, 'mynameisvinodbahadurthapayoutuber');
      // You might want to attach the decoded data to the request for later use
      req.user = decode;
      next();
    } catch (error) {
      res.status(401).send("Unauthorized... Invalid Token!");
    }
  });
};

module.exports = verifyToken;


// function checkAuthStatus(req,res,next){
//     cookieParser()(req,res,()=>{
//         const token = req.cookies.token
//         if (!token) {
//           return res.status(401).json({ error: 'Unauthorized. Token missing.' });
//         }
        
//         // Verify the token and get the user information
//         jwt.verify(token, 'mynameisvinodbahadurthapayoutuber', (err) => {
//           if (err) {
//             return res.status(403).json({ error: 'Unauthorized. Invalid token.' });
//           }else{
//             next()
//           }
//         })
//     });
// }

// module.exports = checkAuthStatus;