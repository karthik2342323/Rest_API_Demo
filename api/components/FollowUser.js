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

                                console.log(" See This Data after Updating Out Side  : "+data);

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

                                            var userWhofollow=data[0].userID;
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





// Trash

// data=JSON.parse(JSON.stringify(data));
/*
str=JSON.stringify(data);
var followerCurrent= data.followers;
var followNew=followUID;
var finalFollower;
followNew.push(followUID);
// add to arr
//followerCurrent.push(followUID);
//followerCurrent=followerCurrent.toArray();
// var merge=[];
if(followerCurrent===undefined)
{
    finalFollower=[{"name":followNew}];
}
else
{

}
followerCurrent=data.toString();
followerCurrent=followerCurrent.replace('\n','').toString();
//followerCurrent=followerCurrent.Array();

 */
