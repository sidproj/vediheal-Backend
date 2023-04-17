const User = require("../models/user");
const Reiki = require("../models/reiki");
const Instructor = require("../models/instructor");
const Benifit = require("../models/benifits");
const Appointment = require("../models/appointments");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Coupon = require("../models/coupon");
const Schedule = require("../models/schedule");


const createJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};

//authentication
module.exports.login_get = async (req,res)=>{
    try{
        console.log(0)
        res.render("./login");
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.login_post = async (req,res)=>{
    console.log(req.body);
    const {email,password} = req.body;
    try{
        const admin = await User.login_admin(email,password);
        if(! admin.is_admin) throw Error("Unauthorised Access");
        const jwtToken = createJWT(admin._id);
        res.cookie("jwt", jwtToken, { httpOnly: true });
        res.redirect("/admin/reikies");
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.logout_get = async (req,res)=>{
    try{
        res.clearCookie("jwt");
        res.redirect("login");
    }
    catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

//admin profile
module.exports.profile_get = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);
        res.render("profile",{admin,status:false});
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.edit_admin = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);
        if(!admin ) throw new Error("No admin found!");

        admin.first_name = req.body.first_name;
        admin.last_name = req.body.last_name;
        admin.email = req.body.email;
        admin.phone_no = req.body.phone_no;

        await admin.save();
        res.redirect(`/admin/profile/${admin.id}`);
        
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.change_admin_password = async (req,res)=>{
    try{
        console.log(req.body);
        const admin = await User.findById(res.user.id);
        if(!admin ) throw new Error("No admin found!");
        if(req.body.new_password != req.body.confirm_password || req.body.new_password.length==0){
            res.render("profile",{admin,status:{conf_pass:true}});
            return;
        }
        const passwordMatched = await User.login_admin(admin.email,req.body.old_password);
        if(!passwordMatched){
            res.render("profile",{admin,status:{pass:true}})
            return;
        }
        admin.password = await User.hashPassword(req.body.  new_password);
        await admin.save();
        res.render("profile",{admin,status:{success:true}});

    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

//user
module.exports.users_get = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);
        const users = await User.find();
        res.render("users",{users,admin});
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.user_get = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);
        const id = req.params.id;
        const user = await User.findById(id);
        res.render("user",{user,admin});
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.edit_user = async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user ) throw new Error("No user found!");

        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
        user.email = req.body.email;
        user.phone_no = req.body.phone_no;

        await user.save();
        res.redirect(`/admin/users/${user.id}`);
        
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.block_user = async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user) throw Error("No user found!");
        user.is_deleted = true;
        await user.save();
        res.redirect(`/admin/users/${user.id}`);
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
};


module.exports.unblock_user = async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user) throw Error("No user found!");
        user.is_deleted = false;
        await user.save();
        res.redirect(`/admin/users/${user.id}`);
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
};

//instructor
module.exports.instructors_get = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);
        const instructors = await Instructor.find();
        res.render("instructors",{instructors,admin});
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.instructor_get = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);
        const instructor = await Instructor.findById(req.params.id);
        const reikies = await Reiki.find({is_deleted:false});
        console.log(instructor);
        res.render("instructor",{instructor,admin,reikies});
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.edit_instructor = async (req,res)=>{
    try{
        const instructor = await Instructor.findById(req.params.id);
        if(!instructor) throw new Error("No user found!");
        console.log(req.body);

        instructor.first_name = req.body.first_name;
        instructor.last_name = req.body.last_name;
        instructor.email = req.body.email;
        instructor.phone_no = req.body.phone_no;
        instructor.instructorReikis = req.body.reikies;
        instructor.description = req.body.description;
        await instructor.save();

        res.redirect(`/admin/instructors/${instructor.id}`);

    }catch(error){
        res.send({error:error.message})
    }
}

//done
module.exports.block_instructor = async (req,res)=>{
    try{
        const instructor = await Instructor.findById(req.params.id);
        if(!instructor) throw Error("No user found!");

        instructor.is_deleted = true;
        await instructor.save();
        res.redirect(`/admin/instructors/${instructor.id}`);
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
};


module.exports.unblock_instructor = async (req,res)=>{
    try{
        const instructor = await Instructor.findById(req.params.id);
        if(!instructor) throw Error("No user found!");

        instructor.is_deleted = false;
        await instructor.save();
        res.redirect(`/admin/instructors/${instructor.id}`);
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
};

//reiki
module.exports.reikis_get = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);
        const reikies = await Reiki.find();
        res.render("reikies",{reikies,admin});
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.reiki_get = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);
        const reiki = await Reiki.findById(req.params.id);
        const benifit = await Benifit.find();   

        res.render("reiki",{reiki,benifit,admin});
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.edit_reiki_post = async (req,res)=>{
    try{
        const reiki = await Reiki.findById(req.params.id);
        if(!reiki) throw new Error("No reiki found");

        // console.log(reiki);
        // console.log(req.body);

        reiki.name = req.body.name;
        reiki.description = req.body.description;
        reiki.image = req.body.image;
        reiki.benifit = [];

        await reiki.save();
        
        const newReiki = await Reiki.findById(req.params.id);
        newReiki.expectations = req.body.expectation;
        newReiki.benifits = req.body.benifit;
        await newReiki.save();
        
        res.redirect(`/admin/reikies/${req.params.id}`);

    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.change_reiki_status = async (req,res)=>{
    try{
        const reiki = await Reiki.findById(req.params.id);
        reiki.is_deleted = !reiki.is_deleted;
        await reiki.save();
        res.redirect(`/admin/reikies/${req.params.id}`);
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}


module.exports.add_reiki_get = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);
        const benifit = await Benifit.find();  
        res.render("addReiki",{benifit,admin});
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.add_reiki_post = async (req,res)=>{
    try{
        const {name,description,image,benifits,expectations} = req.body;
        const reiki = new Reiki({
            name,
            description,
            image,
            benifits,
            expectations
        });
        await reiki.save();
        res.redirect(`/admin/reikies`);
    }catch(error){

    }
}

//appointments
module.exports.appointments_get = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);
        const appointments = await Appointment.find({is_appointed:true});

        for(let i=0;i<appointments.length;i++){
            await appointments[i].populate({
                path: "instructor_id",
                model: Instructor,
            });
            await appointments[i].populate({
                path: "user_id",
                model: User,
            });
            await appointments[i].populate({
                path:"reiki_id",
                model: Reiki, 
            });
        }

        res.render("appointments",{appointments,admin});   
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.appointment_get = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);
        const appointment = await Appointment.findById(req.params.id);
        
        await appointment.populate({
            path: "instructor_id",
            model: Instructor,
        });
        await appointment.populate({
            path: "user_id",
            model: User,
        });
        await appointment.populate({
            path:"reiki_id",
            model: Reiki, 
        });

        res.render("appointment",{appointment,admin});
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.pending_appointments_get = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);

        const appointments = await Appointment.find({is_appointed:false});

        for(let i=0;i<appointments.length;i++){
            await appointments[i].populate({
                path: "user_id",
                model: User,
            });
            await appointments[i].populate({
                path:"reiki_id",
                model: Reiki, 
            });
        }

        res.render("editAppointments",{admin,appointments,admin});   
    }catch(error){
        console.log(error);
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.edit_appointments_get = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);

        const appointment = await Appointment.findById(req.params.id);
        if(!appointment) throw Error("Now appointment found");
        const instructors = await Instructor.find({"instructorReikis":appointment.reiki_id});

        await appointment.populate({
            path: "user_id",
            model: User,
        });
        await appointment.populate({
            path:"reiki_id",
            model: Reiki, 
        });

        await appointment.populate({
            path:"time_slot",
            model:Schedule,
        });

        res.render("editAppointment",{admin,appointment,instructors});

    }catch(error){
        res.send({error:error.message})
    }   
}

module.exports.edit_appointments_post = async (req,res)=>{
    try{
        // const admin = await User.findById(res.user.id);

        const appointment = await Appointment.findById(req.params.id);
        if(!appointment) throw Error("Now appointment found");

        appointment.instructor_id = req.body.instructor_id;
        appointment.meeting_link = req.body.meeting;
        appointment.is_appointed = true;
        await appointment.save();
        // console.log(req.body);
        console.log(await Appointment.findById(req.params.id));
        res.redirect(`/admin/editAppointments/${appointment.id}`);

    }catch(error){
        res.send({error:"Error while setting user"})
    }   
}

// module.exports.delete_appointment = async (req,res)=>{
//     try{
//         const admin = await User.findById(res.user.id);
//         if(!admin || !admin.is_admin)throw new Error("No admin found!");

//         const appointment = await Appointment.findById(req.body.appointment_id);
//         if(!appointment) throw Error("Now appointment found");

//         appointment.is_deleted = true;
//         await appointment.save();
//         res.send({"status":"success","message":"appointment deleted!"})

//     }catch(error){
//         res.send({error:"Error while setting user"})
//     }
// }

//benifits

module.exports.benifits_get = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);
        const benifits = await Benifit.find();
        res.render("benifits",{benifits,admin});
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}


module.exports.benifit_get = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);
        const benifit = await Benifit.findById(req.params.id);
        res.render("benifit",{benifit,admin});
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.change_benifit_status = async (req,res)=>{
    try{
        const benifit = await Benifit.findById(req.params.id);
        benifit.is_deleted = !benifit.is_deleted;
        await benifit.save();
        res.redirect(`/admin/benifits/${req.params.id}`);
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.edit_benifit = async (req,res)=>{
    try{
        const benifit = await Benifit.findById(req.params.id);
        benifit.name = req.body.name;
        await benifit.save();
        res.redirect(`/admin/benifits/${req.params.id}`);
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}


module.exports.add_benifit = async (req,res)=>{
    try{
        const benifit = new Benifit({
            name:req.body.name
        })
        await benifit.save();
        res.redirect(`/admin/benifits`);
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.coupon_get = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);
        const coupon = await Coupon.find();
        res.render("coupon",{coupon,admin});
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.add_coupon = async (req,res)=>{
    try{
        const coupon = Coupon({
            code:req.body.code,
            discount_amt:req.body.discount_amt,
            min_amt:req.body.min_amt
        });
        await coupon.save();
        res.redirect("/admin/coupon");
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.single_coupon_get = async (req,res)=>{
    try{
        const coupon = await Coupon.findById(req.params.id);
        const admin = await User.findById(res.user.id);
        res.render("singleCoupon",{admin,coupon});
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.change_coupon_status = async (req,res)=>{
    try{
        const coupon = await Coupon.findById(req.params.id);
        coupon.is_deleted  = coupon.is_deleted ^ 1;
        await coupon.save();
        res.redirect(`/admin/coupon/${coupon.id}`);
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.edit_coupon = async (req,res)=>{
    try{
        const coupon = await Coupon.findById(req.params.id);
        coupon.code = req.body.code;
        coupon.discount_amt = req.body.discount_amt;
        coupon.min_amt = req.body.min_amt;
        await coupon.save();
        res.redirect(`/admin/coupon/${coupon.id}`);
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.schedule_get = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);
        const schedules = await Schedule.find();

        for(let i=0;i<schedules.length;i++){
            await schedules[i].populate({
                path:"instructor_id",
                model:Instructor
            });
        }

        res.render("schedules",{schedules,admin});

    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.schedule_get_single = async (req,res)=>{
    try{
        const admin = await User.findById(res.user.id);
        const schedule = await Schedule.findById(req.params.id);

        await schedule.populate({
            path:"instructor_id",
            model:Instructor
        });

        res.render("schedule",{schedule,admin});

    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.edit_schedule = async (req,res)=>{
    try{
        const schedule = await Schedule.findById(req.params.id);

        console.log(req.body);
        const date = new Date(req.body.date);

        date.setHours(req.body.time.split(':')[0]);
        date.setMinutes(req.body.time.split(':')[1]);

        schedule.start_time=date;
        await schedule.save();

        res.redirect(`/admin/schedule/${schedule.id}`);
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}

module.exports.change_schedule_delete = async (req,res)=>{
    try{
        const schedule = await Schedule.findById(req.params.id);
        schedule.remove();
        res.redirect('/admin/schedule');
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}