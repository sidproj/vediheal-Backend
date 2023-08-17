const Instructor = require("../models/instructor");
const Reiki = require("../models/reiki");
const jwt = require("jsonwebtoken");
const Appointment = require("../models/appointments");


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
    try {
        const { email, password } = req.body;
        const instructor = await Instructor.login(email, password);
        const jwtToken = createJWT(instructor._id);

        //res.cookie("jwt", jwtToken, { httpOnly: true });
        res.status(200).json({ 
            instructor,
            jwt: jwtToken
        });
    } catch (err) {
        console.log("controller", err);
        res.status(400).json({ error: err.message });
    }
};

  
//controlles signup / register post request from unregistered instructors.
module.exports.signup_post = async (req, res) => {
    const { first_name, last_name, email, phone_no, password, confirm_password } = req.body;

    console.log(req.body);

    try {
        if (password === confirm_password) {
            const instructor = Instructor({
                first_name,
                last_name,
                email,
                phone_no,
                password,
            });
            await instructor.save();

            instructor.password = await Instructor.hashPassword(instructor.password);
            instructor.save((err, instructor) => {
                if (err) throw new Error("An error occurred while saving the instructor!");
            });

            const jwtToken = createJWT(instructor._id);
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
      const instructor = await Instructor.findById(res.user.id);
      console.log(instructor);
      if(!instructor) throw new Error("No user found!");
      
    //   await instructor.populate({
    //     path:"instructorReikis",
    //     model:Reiki
    //   });

      console.log(instructor);

      const first_name = instructor.first_name;
      const last_name = instructor.last_name;
      const phone_no = instructor.phone_no;
      const email = instructor.email;
      const reikies = instructor.instructorReikis;
      const description = instructor.description;



      res.send({
          instructor: { first_name, last_name, phone_no, email,reikies,description },
      });
    }catch(error){
        res.send({error:"No Insturctor found!"});
    }
};

module.exports.profile_post = async(req,res)=>{
    try{
        const instructor = await Instructor.findById(res.user.id);
        if(!instructor) throw new Error("No user found!");
        instructor.first_name = req.body.first_name;
        instructor.last_name = req.body.last_name;
        instructor.phone_no = req.body.phone_no;
        instructor.email = req.body.email;
        instructor.description = req.body.description;

        await instructor.save();
        const jwtToken = createJWT(instructor._id);

        res.send({instructor,jwt:jwtToken});
    }catch(error){
        res.send({"error":"error","message":"No user found!"});
    }
}

module.exports.add_reiki_post = async (req,res)=>{
    try{
        const instructor = await Instructor.findById(res.user.id);
        if(!instructor) throw new Error("No instructor found!");
        instructor.instructorReikis =[ ...req.body.reiki]
        console.log(instructor);
        await instructor.save();
        res.send({instructor:{
            instructorReikis:instructor.instructorReikis,
        }});
    }catch(error){
        res.send({"error":"error","message":error.message});
    }

}

module.exports.get_all_instructors = async (req,res)=>{
    try{
        const instructors = await Instructor.find();
        // console.log("test");
        
        for(let i=0;i<instructors.length;i++){
            await instructors[i].populate({
                path:"instructorReikis",
                model:Reiki
            });
        }
        res.send(instructors);
    }catch(error){
        res.send({error:"Error while getting instructor"});
    }
}

module.exports.get_all_instructors_by_reiki = async (req,res)=>{
    try{
        console.log("req body: ",req.body);
        const instructors = await Instructor.find({ "instructorReikis":req.body.reiki });
        // console.log(instructors);
        res.send(instructors);
    }catch(error){
        res.send({error:"No instructor found!"})
    }
}

module.exports.get_instructor_reikis = async (req,res)=>{
    try{
        console.log(req.body);
        const instructor = await Instructor.findById(res.user.id);

        const reikies = await Reiki.find();
        const instructorReikies={};
        const result = [];

        await instructor.populate({
            path:"instructorReikis",
            model:Reiki,
        });


        for(let i=0;i<reikies.length;i++){
            instructorReikies[reikies[i].id] = {
                name:reikies[i].name,
                selected:false,
            }
        }
        
        for(let i=0;i<instructor.instructorReikis.length;i++){
            const r = instructor.instructorReikis[i];
            instructorReikies[r.id].selected = true;
        }

        for(const key in instructorReikies){
            result.push(
                {
                    id:key,
                    name:instructorReikies[key].name,
                    selected:instructorReikies[key].selected,
                }
            )
        }
        res.send(result);

    }catch(error){
        res.send({error:"No instructor found!"});
    }
}

module.exports.set_instructor_reikis = async(req,res)=>{
    try{
        const data = req.body.data;
        console.log(data);

        const instructor = await Instructor.findById(res.user.id);

        const reikies = [];

        for(let i=0;i<data.length;i++){
            if(data[i].selected )
            reikies.push(data[i].id);
        }
        instructor.instructorReikis = reikies;
        await instructor.save();
        res.send(data);

    }catch(error){
        res.send({error:"No instructor found!"});
    }
}

// module.exports.set_time_slots = async (req,res)=>{
//     try{
//         console.log(req.body);
//         const appointment = await Appointment.findById(req.body.appointment_id);

//         if(!appointment) throw Error("No appointment found!");
//         appointment.slots = req.body.slots;
//         await appointment.save();
//         res.send(await Appointment.findById(req.body.appointment_id));
        
//     }catch(error){
//         res.send({error:error.message})
//     }
// }


module.exports.change_password = async (req,res)=>{
    try{
        const user = await Instructor.findById(res.user.id);
        if(!user) throw Error("No user found");
        console.log(user);
        console.log(req.body);
        console.log(0);
        if(req.body.password != req.body.confirm_password || req.body.password.length==0) throw Error("Password do no match");
        
        const passwordMatched = await Instructor.login(user.email,req.body.old_password);
        if(!passwordMatched) throw Error("Incorrect Password");

        user.password = await Instructor.hashPassword(req.body.password);
        await user.save();
        res.send({status:"success","message":"Password change successfully"});

    }catch(error){
        res.send({status:"Error","message":error.message});
    }
}