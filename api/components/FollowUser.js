const user=require("../models/user");

exports.List=function (req,res) {

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

    // launch in buffer since Its not working in cascade But When to launch depends on US
    var users=[];
    user.find({}).exec()
        .then(data=>
        {

            // check If Its empty or not
            if(data.length>=1)
            {
                for(var i=0;i<data.length;i++)
                {
                    // Not to load Own UID have an List of Others
                    if(data[i].email===email)
                    {
                        continue;
                    }
                    var name=data[i].userID;
                    users.push(name);
                }
            }
            //res.status(200).json({names:users});
        })
        .catch(error=>{
            return  res.status(401).json({Message:" Cannot Fetch User , Error : "+error});
        });


    // Main part
    user.find({email:email,token:token}).exec()
        .then(data=>
        {
            // Now Even If Data is not available then Also Var is True because
            // Its Allocated to arr which is empty so track the length
            if(data.length>=1)
            {
                console.log(" Success");
                res.status(200).json({AccountID:users});
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


/*
 Like If U wanna to follow
 */
exports.follow=function (req,res) {

    var email=req.body.email;
    var token=req.body.token;
    var followUID=req.body.followUID;

    if(!email)
    {
        return res.status(401).json({
            message:'Email Not exist SO Put Email  '
        });
    }
    console.log(" See This Email : "+email);
    console.log(" See This Token : "+token);

    // Load in buffer
    var users=[];
    user.find({}).exec()
        .then(data=>
        {
            // check If Its empty or not
            if(data.length>=1)
            {
                for(var i=0;i<data.length;i++)
                {
                    // Not to load Own UID have an List of Others
                    if(data[i].email===email)
                    {
                        continue;
                    }
                    var name=data[i].userID;
                    users.push(name);
                }
            }
            //res.status(200).json({names:users});
        })
        .catch(error=>{
            return  res.status(401).json({Message:" Cannot Fetch User , Error : "+error});
        });

    var UIDExist=function(UID)
    {
        for(var i=0;i<users.length;i++)
        {
            if(users[i]===UID)
            {
                return true;
            }
        }
        return false;
    };


    // Main part
    user.find({email:email,token:token}).exec()
        .then(data=>
        {

            // for debugging
            var myUID=data[0].userID;
            // for debuging
            if(data.length>=1)
            {
                if(followUID)
                {
                    var result=UIDExist(followUID);
                    // exist means we can follow
                    if(!result)
                    {
                        return  res.status(401).json({Message:" UID Not found "});
                    }
                    else
                    {
                        // Need to use index 0 otherise Not defined


                        var currentFollowerList=data[0].following;

                        var prev_copy=currentFollowerList;

                        var newFollower={name:followUID};

                        console.log(" See THIS CurrentFollower : "+currentFollowerList+" Name : "+currentFollowerList);
                        // check whether we are already followed or not
                        if(currentFollowerList!==undefined)
                        {
                            console.log(" is Defined ");
                            currentFollowerList=JSON.parse(currentFollowerList);
                            for(var i=0;i<currentFollowerList.length;i++)
                            {
                                console.log(" See This Following : "+currentFollowerList[i]+" Comparison : "+followUID);
                                if(currentFollowerList[i].name===followUID)
                                {
                                    return  res.status(401).json({Message:" U are already following No need to  adding Follower : "+followUID});
                                }
                            }
                        }
                        /*
                             Paradigm of JSON

                             var x=[];
                             x[x.length]={X:"fourth"};
                             x[x.length]={X:"fifth"};
                         */

                        if(currentFollowerList===undefined)
                        {
                            currentFollowerList=[];
                        }
                        currentFollowerList[currentFollowerList.length]=newFollower;
                        // Now for storing perspective store in string but while fetching
                        // convert to JSON
                        //currentFollowerList=JSON.stringify(currentFollowerList);
                        currentFollowerList=JSON.stringify(currentFollowerList);

                        // return  res.status(200).json({Message:" Proceed Yet :          "+str+" undefied  : "+followerCurrent});
                        //data=JSON.stringify(data).toString();
                        //data=data.replace("/","");
                        //return  res.status(200).json({Message:" Proceed Yet :   Working  "+(data[0].followers===undefined)});

                        // Add to array List which is in DB
                        user.updateOne({email:email,token:token},{$set: {following:currentFollowerList}},{returnOriginal : false})
                            .exec()
                            .then(data=>{

                                console.log(" See This Data after Updating Out Side  : "+data[0]);

                                if(data.length>=1 || data )
                                {
                                    // I mean We had added on Our Profile But On that User Need to update Follower


                                    user.find({userID:followUID}).exec()
                                        .then(data=>{
                                            var arr=[];
                                            var temp=data[0].followers;
                                            console.log(" See This Inside : "+temp);
                                            if(temp!==undefined)
                                            {
                                                arr=JSON.parse(temp);
                                            }

                                            //myUID
                                            //  var userWhofollow=data[0].userID;
                                            var userWhofollow=myUID;
                                            userWhofollow={name:userWhofollow};
                                            arr[arr.length]=userWhofollow;
                                            arr=JSON.stringify(arr);
                                            user.updateOne({userID:followUID},{$set: {followers:arr}},{returnOriginal : false}).exec()
                                                .then(data=>{
                                                    if(data)
                                                    {
                                                        console.log(" Successfull ");
                                                    }
                                                    else
                                                    {
                                                        console.log(" Follower  Not exist in DB")
                                                    }
                                                })
                                                .catch(error=>{
                                                    if(error)
                                                    {
                                                        console.log(" Error : "+error);
                                                    }
                                                });

                                        })
                                        .catch(error=>{
                                            console.log(" Error while fetching the data from Follower to whon U Had followed")
                                        });
                                    console.log(" See Followers : "+arr.length);


                                    // Update on the person We are following like Ad on the follower List
                                    return  res.status(200).json({Message:" Follower Added  : "+followUID});
                                }
                                else
                                {
                                    return  res.status(401).json({Message:" Error while adding Follower _1 : "+followUID});
                                }
                            })
                            .catch(error=>{
                                if(error)
                                {
                                    console.log(" Error while adding follower ");
                                    return  res.status(401).json({Message:" Error while adding Follower _2: "+followUID});
                                }
                            });




                    }
                }
            }
            else
            {
                return  res.status(401).json({Message:" UID NOt found to be follow"});
            }
        })
        .catch(error=>
        {
            return  res.status(401).json({Message:" Error while fetching data ",Error:error});
        });


};



exports.removeFollowing=function (req,res) {
    var userID=req.body.userID;
    var token=req.body.token;
    var targeted=req.body.targeted;

    user.find({userID:userID,token:token}).exec()
        .then(data=>{
          if(data.length<1)
          {
            return   res.status(401).json({ MSG:" Credintial Mismatch"});
          }
        })
        .catch(error=>{
           if(error)
           {
                  res.status(401).json({ MSG:" Credintial Mismatch"});
           }
        });

    user.find({userID:userID,token:token}).exec()
        .then(data=>{
            // Now the funda is If we are removing the following then Then Targeted follower will get decrease
            // So update on Both side
            if(data.length>=1 || data)
            {
                var arr=data[0].following;
                if(arr===undefined)
                {
                     res.status(401).json({MSG:" U have no following"});
                }
                arr=JSON.parse(arr);
                // check If exist
                for(var x=0;x<arr.length;x++)
                {
                    console.log(" Insider :  name : "+arr[x].name+" ,  val : "+targeted);
                    if(arr[x].name===targeted)
                    {
                        arr.splice(x, 1);
                    }
                }
                arr=JSON.stringify(arr);
                // update
                user.updateOne({userID:userID},{$set: {following:arr}},{returnOriginal : false}).exec()
                    .then(data=>{
                        if(data || data.length>=1)
                        {
                            console.log(" Updated on Own System");
                        }
                        else
                        {
                            console.log(" data not found");
                        }
                    })
                    .catch(error=>{
                       console.log(" Error : "+error);
                    });
            }
        })
        .catch(error=>{
            if(error)
            {
                //return res.status(401).json({MSG:" Error : "+error});
                console.log(" Error while fetching Data");
            }
        });
    // On Guy to which U had followed means Its count as an follower to him/her
    user.find({userID:targeted}).exec()
        .then(data=>{
            if(data)
            {
                var followers=data[0].followers;
                // need to check whether It is defined or it is following any one
                if(followers===undefined)
                {
                    return res.status(401).json({MSG:" Undefied  "});
                }
                followers=JSON.parse(followers);
                for(var i=0;i<followers.length;i++)
                {
                    console.log(" compare "+followers[i].name+" userID"+" userID : ");
                    if(followers[i].name===userID)
                    {
                        followers.splice(i, 1);
                    }
                }
                followers=JSON.stringify(followers);

                // Update
                user.updateOne({userID:targeted},{$set: {followers:followers}},{returnOriginal : false}).exec()
                    .then(data=>{
                        if(data.length || data)
                        {
                            return res.status(200).json({MSG:"Successfull"});
                        }
                    })
                    .catch(error=>{
                       if(error)
                       {
                           return res.status(400).json({MSG:" Error Part Last : "+error});
                       }
                    });
            }
        })




};

