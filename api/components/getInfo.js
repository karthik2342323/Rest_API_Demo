
const user=require("../models/user");
/*
  Now Token are allocated during Signup  and Thrown as an message via Login If Forgot then
  So Check the token but according to domain of User
  eg User
          -> Token


 Now Taking User as an email and Token Via body

 Request Code :
                 401 : Lack in Info like Para
                 500 : For Error or not found
                 502 : Bad Gateway
                 200 : Success

                 Our Use : 401,200

 */

exports.getInfo=function (req,res) {
    var email=req.body.email;
    var token=req.body.token;

    if(!email)
    {
        return res.status(401).json({
            message:'Email Not exist SO Put Email  '
        });
    }
    console.log(" See This Email : "+email);
    console.log(" See This Token : "+token);
    if(!token)
    {
        return res.status(401).json({
            message:'Token Not exist So Put Token'
        });
    }
    // Else
    user.find({email:email,token:token}).exec()
        .then(data=>
        {
            // Now Even If Data is not available then Also Var is True because
            // Its Allocated to arr which is empty so track the length
            if(data.length>=1)
            {
                return res.status(200).json({
                    data: data,
                });
            }
            else
            {
                return  res.status(401).json({Message:" Data not found"});
            }
        })
        .catch(error=>
        {
            return  res.status(401).json({Message:" Error while fetching data ",Error:error});
        });

};
