const User = require("../models/user");
const jwt = require("jsonwebtoken");


const createJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};

const handleErrors = (err) => {
    let errors = {
        first_name: null,
        last_name: null,
        email: null,
        password: null,
        phone_no: null,
        confirm_password: null,
    };

    //   Check for duplicate email with err.code
    if (err.code == 11000) {
        errors.email = "Email already exists";
        return errors;
    }

    console.log(err);

    // validate errors
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach((e) => {
        errors[e.path] = e.message;
        });
    } else errors.confirm_password = err.message;
    return errors;
};


module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const jwtToken = createJWT(user._id);

    //   res.cookie("jwt", jwtToken, { httpOnly: true });
        res.status(200).json({ 
            message: "Login successful!",
            jwt: jwtToken
        });
    } catch (err) {
        console.log("User controller: ", err);
        res.status(400).json({ error: err.message });
    }
};

  
//controlles signup / register post request from unregistered users.
module.exports.signup_post = async (req, res) => {
    const { first_name, last_name, email, phone_no, password, confirm_password } = req.body;

    console.log(req.body);

    try {
        if (password === confirm_password) {
            const user = User({
                first_name,
                last_name,
                email,
                phone_no,
                password,
            });
            await user.save();

            user.password = await User.hashPassword(user.password);
            user.save((err, user) => {
                if (err) throw new Error("An error occurred while saving the user!");
            });

            const jwtToken = createJWT(user._id);
            res.status(201).json({ 
                message: "Registration Successful",
                jwt:jwtToken
            });
        } else throw Error("Passwords must match");
    } catch (err) {
        const errors = handleErrors(err);
        console.log(errors);
        res.status(400).json({ errors: errors });
    }
};

module.exports.profile_get = async (req, res) => {
    try{
      const user = await User.findById(res.user.id);
      console.log(user);
      if(!user) throw new Error("No user found!");
      const first_name = user.first_name;
      const last_name = user.last_name;
      const phone_no = user.phone_no;
      const email = user.email;

      res.send({
          user: { first_name, last_name, phone_no, email },
      });
    }catch(error){
        res.send({"error":"error","message":"No user found!"});
    }
};

module.exports.profile_post = async (req, res) => {
    try{
        const user = await User.findById(res.user.id);
        console.log(user);
        if(!user) throw Error("No user found!");
        
        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
        user.phone_no = req.body.phone_no;
        user.email = req.body.email;
        
        await user.save();
        res.send({
            user:{
                first_name:user.first_name,
                last_name:user.last_name,
                phone_no:user.phone_no,
                email:user.email
            }});
    }catch(error){
        res.send({"error":"error","message":"No user found!"});
    }
  };
    


module.exports.change_password = async (req,res)=>{
    try{
        const user = await User.findById(res.user.id);
        if(!user) throw Error("No user found");
        console.log(user);
        console.log(req.body);
        console.log(0);
        if(req.body.password != req.body.confirm_password || req.body.password.length==0) throw Error("Password do no match");
        
        const passwordMatched = await User.login(user.email,req.body.old_password);
        if(!passwordMatched) throw Error("Incorrect Password");

        user.password = await User.hashPassword(req.body.password);
        await user.save();
        res.send({status:"success","message":"Password change successfully"});

    }catch(error){
        res.send({status:"Error","message":error.message});
    }
}