const express = require('express');
const router = express.Router();
const userComponents = require('../components/user');
const myInfo=require('../components/getInfo');
const users=require('../components/FollowUser');
const forExp=require('../components/forEXP_DEBUGG');
const  data=require('../components/forEXP_DEBUGG');

router.post('/signup',userComponents.signup);

router.post('/login',userComponents.login);

router.post('/getMyData',myInfo.getInfo);
router.post('/listOfUser',users.List);
router.post('/toFollow',users.follow);

router.delete('/delete/:userID/:token',userComponents.deleteUser);

router.post('/updateAccount',userComponents.updateAccount);



router.get('/forExp',forExp.first123456);
router.post('/putData',data.putJSONData);
router.post('/addData',data.ADDJSONData);
router.post('/removeFollowing',users.removeFollowing);
router.post('/forExpDataFlow',forExp.testFetchingDatas);

module.exports = router;

