const Reiki = require("../models/reiki");
const Benifit = require("../models/benifits");

// module.exports.set_reiki_info = async(req,res)=>{
//     const names=["Anti-Depression Reiki","Pain Relief Reiki","Reiki for Addiction and detoxification","Sleep Disturbance Reiki","Health Crisis Reiki"]
//     const descriptions = [
//         "Reiki is a scientific and research-proven technique to get rid of anxiety and depression through our body’s natural healing ability.",
//         "Reiki is a scientific and research-proven technique that helps decrease pain perception by healing the emotional aspect of pain.",
//         "Reiki helps a person to shift their energy in a positive direction and no longer want to use or abuse any illicit substances.",
//         "Reiki is a scientific and research-proven technique that helps in solving the problems like Insomnia or Narcolepsy.",
//         "Support the well-being of people receiving traditional medical treatments such as chemotherapy, radiation, surgery, and kidney dialysis."
//     ]
//     for(let i=0;i<names.length;i++){
        
//         const reiki = new Reiki({
//             name:names[i],
//             description:descriptions[i],
//             image:"",
//             benifits:[],
//         })
//         await reiki.save();
//     }
//     res.send("saved");
// }

module.exports.set_benifits_info = async (req,res)=>{
    const names = ["Science Proven",
    "Cost Effective",
    "Boosts Mood",
    "Relieves Anxiety",
    "Heals Depression",
    "Science Proven",
    "Pain Relief",
    "Emotional Distress",
    "Smooth Detoxification",
    "Proper sleep pattern",
    "Gives Control",
    "Facilitates interpersonal connections",
    "Positivity",
    "Wellness",
    "Relaxation",
    "Peace"]
    for(let i=0;i<names.length;i++){
        const benifit = new Benifit({
            name:names[i],
        })
        await benifit.save();
    }
    res.send("Saved benifits");
}