const stripe = require("stripe")('sk_test_51NNAjOSAZExnf8Z4CJ5G0znCQBrS9CXXETlM2vKBKmmzChQ3QDnkVblFJb3AqbCQNDu2Ntqs7DxEUynAJd1fWhxj00F0aUaMNY');


module.exports.createPaymentIndent = async(req,res)=>{


  /*
    req.body.service {
      price: amount (int)
    }
  */

  console.log(req.body);
  const service = req.body.service;
  const paymentIntent = await stripe.paymentIntents.create({
      amount: service.price * 100,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(paymentIntent.client_secret);
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
}