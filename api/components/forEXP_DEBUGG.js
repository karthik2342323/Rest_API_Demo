const user=require('../models/user');

exports.first123456=(req,res)=>
{
  user.find({email:"user1@outlook.com"}).exec()
      .then(data=>{
          if(data)
          {
              console.log("See This : "+data);
              res.status(200).json({Message:"Successfull  Data : "+data});
          }
          else
          {
              console.log(" error ");
              res.status(401).json({Message:"UNSuccessfull"});
          }
      });

};

