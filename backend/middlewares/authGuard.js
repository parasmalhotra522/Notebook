import jwt from 'jsonwebtoken';

export const authGuard = (req, res, next) => {

    let token;


    if (req.cookies.jwt) {

        try {
            token = req.cookies.jwt;
            console.log("Token", token);
            const decodedData =  jwt.verify(token, process.env.JWTSecretKey);
            // console.log("DECODED", decodedData);
            req.userId = decodedData.id;
            next();
            
        } catch (error) {
                      res.status(401).send({"error": "Invalid Token"})
  
        }
    }
    if(!token) {
            res.status(401).send({"error": "Invalid Token"})
    }






}