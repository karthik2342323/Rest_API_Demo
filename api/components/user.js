const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const moment=require('moment');

/*
   SignUp Process : first We gonna find the email If Its already Exist means Someone is holding
   so ask different One or If Its Unique Means Not exist in system then Fetch along with other detail
   like name or address Detain on /model/user
 */
exports.signup = (req,res,next)=>{

	// find in buffer list of

	var users=[];
	User.find({})
		.then(data=>
		{

			// check If Its empty or not
			if(data.length>=1)
			{
				for(var i=0;i<data.length;i++)
				{
					var name=data[i].userID;
					users.push(name);
				}
			}
			//res.status(200).json({names:users});
		})
		.catch(error=>{
			return  res.status(401).json({Message:" Cannot Fetch User , Error : "+error});
		});

	/*
	 If UID found then Its return true else false
	 */
	var findUser=function (username){
		for(var i=0;i<users.length;i++)
		{
			console.log("--------------------- See this Compare UID  "+users[i]+"  : "+username);
			if(users[i]===username)
			{
				//console.log("--------------------- See this Compare UID  "+users[i]+"  : "+username);
				return true;
			}
		}
		// else not found
		return false;
	};


	User.find({email:req.body.email})
		.exec()
		.then(user =>{
			// If User found then throw msg "Exist"
			if(user.length >= 1){
				console.log(user);
				return res.status(409).json({
					message:'User Email  Already Exist Try Another one'
				});
			}
			// Else Its not found in system then Encrypt passwd  add data to Db
			else{

				// first check UID If Its present
				if(req.body.userID)
				{
					console.log("------------------- See this UID : "+req.body.userID);
					var success=findUser(req.body.userID);
					// We got But Since its an Signup so So Throw MSG
					if(success)
					{
						return  res.status(401).json({Message:" UID Exist try with Different One "});
					}
					console.log("See this UID Check : "+success);
				}
				else
				{
					return  res.status(401).json({Message:" UID NOT Exist "});
				}

				bcrypt.hash(req.body.password,10,(err,hash)=>{
					if(err){
						return res.status(500).json({
							error:err
						});
					}
					else{
						const user = new User({
							_id:new mongoose.Types.ObjectId(),
							email:req.body.email,
							password:hash,
							name:req.body.name,
							dob:req.body.dob,
							address:req.body.address,
							description:req.body.description,
							userID:req.body.userID,
							token:tokenGenerator(),
							createdAt:""+moment().format('MMMM Do YYYY, h:mm:ss a')
						});
						user
							.save()
							.then(result=>{
								console.log(result);
								res.status(201).json({
									message:'User Successfully Created!!'
								});
							});
					}
				});	
			}

		})
		.catch(err=>{
			console.log(err);
			res.status(500).json({
				error:err
			});
		});
};

/*
     Login : Its simple First Check If Email is exist If It is then check the passwd
     if Its match then Throw Appropriate message and Even If Email is wrong or passwd is incorrect
     then Not to specify Just gave Message "Either Email is incorect or passwd " That would make less
     vulnerable  .

     Now the funda is During Signup Token will be allocated so While Login with Credential will get same token
     So even If U dont have Token Just Login and System Will Throw token
     Now That Token follow domain
      User
           -> Token
      So Access layer will get domain User and Inside Token and We can use JWT Also for that

      So for traverse of any Page Like According to Requirement Just Throw email and Token
      Just Like what we DO In Oauth 2.0 like In  Header API Key and Body Data and Link

 */

exports.login = (req,res,next)=>{
	User.find({email:req.body.email})
		.exec()
		.then(user=>{
			if(user.length < 1){
				return res.status(401).json({
					message:'Auth Failed!!'
				});
			}
			else{
				bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
					if(err){
						// console.log(err);		
						return res.status(401).json({
							message:'Auth Failed!!'
						});
					}
					if(result){
						/*
						const token = jwt.sign(
							{
								email:user[0].email,
								Id:user[0]._id
							},
							'secret',
							{
								expiresIn:'1h'
							}
						);

						 */
						const token=user[0].token;

						return res.status(200).json({
							message:'Auth Successful!!  U will Require This Token for Traversing any Page',
							token:token
						});
					}
					return res.status(401).json({
						message:'Auth Failed!!'
					});
				});
			}
		})
		.catch(err=>{
			console.log(err);
			res.status(500).json({
				error:err
			});
		});
};

/*
   Link/userID/Token
 */
exports.deleteUser = (req,res,next)=>{


	var token=req.params.token;
	var userID=req.params.userID;




	// Check the Token for auth If Its valid
	User.find({userID:userID,token:token})
		.exec()
		.then(data=>{
			if(!!data  || data==null || data.length<1)
			{
				return req.send(401).json({Message:"Either Token or username not found "});
			}
		})
		.catch(error=>{
			if(error)
			{
				return req.send(401).json({Message:" Error : "+error});
			}
		});




	User.remove({userID:userID})
		.exec()
		.then(result=>{
			res.status(200).json({
				message:'User successfully deleted!!'
			})
		})
		.catch(err=>{
			console.log(err);
			res.status(500).json({
				error:err
			});
		});


};


exports.updateAccount=function(req,res) {


	// Auth

	let x="";
	var token=req.body.token;
	var userID=req.body.userID;

	/*
	if(req.body.token)
	{
		res.status(200).json({MSg:"first"});
	}

	 */


 User.find({token:token,userID:userID}).exec()
     .then(data=>
	 {

         if(data.length<1)
         {
              return res.status(401).json({Message:" Not found "});
         }
         else
         {
             //console.log(" See this data Inner : "+data.name);
			 console.log(" See this Data : "+data);

			 x=data[0];
			 console.log(" See this data Assign : "+x.name);
             //return res.status(200).json({Message:" success "});



			 /*
                  email ,
                    password: { type: String, required: true },
                    userID:{type:String,require:true},
                      name:{type:String,required: true},
                   dob:{type:String,required: true},
                 address:{type:String,required:true},
                   description: {type:String,required:true},
                      token:{type:String,required:true},
                       followers:{type:String},
                       following:{type:String},

             */


			 // Now User may or may not Update All Data
			 // So take whatever para in Body and rest from Default


			 //console.log(" See This Datas : "+x[0].name);

			 console.log(" See This Data : "+x);



             var email=req.body.email || x.email;
             var name=req.body.name   || x.name;
             var dob=req.body.dob     || x.dob;
             var address=req.body.address || x.address;
             var description=req.body.description || x.description;





			// return res.status(200).json({MSG:"Here It is see this data  Name : "+name+" Address : "+address});


			 console.log(" Happening : ");



             User.updateOne({userID:userID,token:token},{$set: {email:email,name:name,dob:dob,address:address,description:description}}
             ,{returnOriginal : false})
                 .exec()
                 .then(data=>{
                     if(data)
                     {
                         console.log(" Got Data");
                         return res.status(200).json({MSG:" Data Updated successfully"});
                     }
                     else
                     {
                        return  res.status(401).json({MSG:" Data not found"});
                     }
                 })
				 .catch(error=> {
					 if(error)
					 {
						 res.status(401).json({MSG:"Error"+error});
					 }
				 });











		 }



	 	/*
	 	if(data)
		{
			return res.status(200).json({MSG:"Successfull"});
		}

	 	 */
     })
     .catch(error=>{
         if(error)
         {
             //return res.send(401).json({Message:"Not found "});
         }
     });






	/*
	 email ,
    password: { type: String, required: true },
    userID:{type:String,require:true},
    name:{type:String,required: true},
    dob:{type:String,required: true},
    address:{type:String,required:true},
    description: {type:String,required:true},
    token:{type:String,required:true},
    followers:{type:String},
    following:{type:String},

	 */


	// Now User may or may not Update All Data
	// So take whatever para in Body and rest from Default


	//console.log(" See This Datas : "+x[0].name);

	console.log(" See This Data : "+x);


	/*
	var email=req.body.email || x[0].email;
	var name=req.body.name   || x[0].name;
	var dob=req.body.dob     || x[0].dob;
	var address=req.body.address || x[0].address;
	var description=req.body.description || x[0].description;

	 */



	//res.status(200).json({MSG:" see this data "+x});



	/*


	User.updateOne({userID:userID,token:token},{$set: {email:email,name:name,dob:dob,address:address,description:description}}
	,{returnOriginal : false})
		.exec()
		.then(data=>{
			if(data)
			{
				console.log(" Got Data");
				req.status(200).send(" Data Updated successfully");
			}
			else
			{
				req.status(401).send(" Data not found");
			}
		})
		.catch(error=> {
			req.status(401).send(" error : "+error);
	      });


	 */


};



// Token Generator


/*
    @Para -len , type -int
    Description  : If length is bigger Means More combination means Less chances of getting Same Occurrence
    Standard Length : U can Choose any length >300 is recommended
 */
var tokenGenerator=function ()
{
	// Length Of Token for Security
	// token_len=474;
	var token_len=474;
	var passwd_len=10;

	var x=Math.random();
	var y=x*64;
	var z=Math.floor(y);
	// for debugging

	var char=String.fromCharCode(122);
	var salt="fj3j4ndk3j";
	var counter_1=0;
	var random_1=0;
	var timer=0;
	var signal=0;




	// for debugging
	salt="";
	// generate token or salt
	for(var i=0;i<token_len;i++)
	{
		// math.floor just gonna remove the digit
		x=Math.floor(Math.random()*123);
		console.log(" See This  Random Number : "+x);
		if(x>=65 && x<=90 || x>=97 && x<=122 || signal===1)
		{
			// condition 1 : track Make it to smaller case
			/*
            if(x>=65 && x<=90)
            {
              x+=32;
            }

             */
			// At Same Time we dont want Any
			if(signal===1 && (x>=65 && x<=90)===false && (x>=97 && x<=122)===false )
			{
				// Message
				console.log(" Inside_signal  Random Val :  "+x);

				// Now since If signal is 1 then Its depends on random so take the condition of half of 122 i.e 56
				// and If Its lie below 56 then Its capital Otherwise Its smaller
				x=Math.floor(Math.random()*123);
				// case If Its Bigger
				if(x<=56)
				{
					// try Untill U get Random On That Range
					for(var c=33;c>12;c++)
					{
						x=Math.floor(Math.random()*91);
						if(x>=65 && x<=90)
						{
							break;
						}
					}
				}
				// If Its smaller
				else
				{
					x=Math.floor(Math.random()*123);
					// Try Untill U get in that Range
					for(var c=34;c>12;c++)
					{
						x=Math.floor(Math.random()*123);
						if(x>=97 && x<=122)
						{
							break;
						}
					}
				}
				// reset signal condition
				if(counter_1>=timer)
				{
					signal=0;
				}
				else
				{
					counter_1++;
				}
			}



			// for debugging Pure experimental
			// No Big deal If Signal is 1 then Convert to Upper case
			if(signal===1 && (x>=97 && x<=122) )
			{
				x-=32;
			}
			// for debugging Pure experimental


			// convert int to char
			salt+=String.fromCharCode(x);
		}
		else
		{
			// for Making Int less occurrence
			/*
            counter_1++;
            random_1=Math.floor(Math.random()*130);
            var s_1=""+random_1;
            random_1=parseInt(s_1.charAt(s_1.length-1));
            timer=random_1;

             */
			signal=1;
			random_1=Math.floor(Math.random()*123);
			var s_2=""+random_1;
			timer=parseInt(""+s_2.charAt(s_2.length-1));
			counter_1=0;



			// very rare case
			if(x===0)
			{
				for(var p=5;p>1;p++)
				{
					x=Math.floor(Math.random()*130);
					var temp_1=""+x;
					var  num_1=parseInt(""+temp_1.charAt(temp_1.length-1));
					if(num_1!==0)
					{
						break;
					}
					console.log("See this rare case : "+num_1);
				}
				//x++;
			}
			var lastDigit=""+x;
			salt+=parseInt(""+lastDigit.charAt(0));
		}
	}

	var token_1=salt;

	return token_1;
};
