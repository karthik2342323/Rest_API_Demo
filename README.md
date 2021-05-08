# Rest_API_Demo

Over Here Its an Rest Api Demo which is an which follow common RestFull Structure

Technology 

Backend - node.js 
DB - mongodb
framwork- express.js


So Now How to run let see 




step 1: Install package via either Yarn or NPM once . Its done  Then head in to the
 dir /app where where U gonna find {const connectionURL} set To Ur URL  Likewise 
 
 const connectionURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/UR_Collections_name';
 
 
 step 2:  If U Use Yarn 
               (Command :   yarn run start)
               
               
          If U Use NPM 
               (command : num run start)
               
               
step 3: Since Its API So to Test Use curl download for windows or linux any OS
        
        Here are some curl command for test
        
        ---------   signup   ----------------
        
        curl -d "email=user5@outlook.com&password=123456789&name=asdfg&dob=23/02/2000&address=werthyhgfds,sdfghhsdfrg,sdefrgth&description=sdfghnj&userID=second12" -X POST http://localhost:3000/user/signup
        Responce :  {"message":"User Successfully Created!!"}

       -------------- Login  --------------------

    curl -d "email=user5@outlook.com&password=123456789" -X POST http://localhost:3000/user/login
      Responce :   {"message":"Auth Successful!!  U will Require This Token for Traversing any Page","token":"4QTIWBj4SVREVLMFWFZTxV1QHYPZFCBTLAMf4LGDSSFLILQBUd9YQkGYWn3IMGDKQWFPUJQBMqQ3NPCTOXMUTJIp4LRQFNUFn5NXAIQOVFONUTF6VDVIZIPRINK5WGDPPOQKHHR3NFKKDEQSQYLD1FFLhJ3NCZVFz4KUTHYNRDYLBESTxs1ZTGKZm3Nr3PFDJKRVQKF5ZUUHWZJOEHBWr3BBWNYm4OTWFQRNWNFON1LCDNHPRBREKV3HO4IOKERc6TBBQDCUMa9GIOOHGMKPQvj1STPFBHKx4NOVGDGMQHJOOCGCE1AGOWPLCGN4PQSPNCFPQELGTj4XFSGRCIHFDDFQOGtu2WRAMSEZ2BARRANBYLLZe5VMHVLWK3AFONBDDRCPhOm2WHTEdgaKBSVF5RWPHTALZUCSd3FIGMLOHYMFLQBj3B3UNDOHLLVWGKFESDMCDMGIBy3DGRFYH5ONFYYBLL"}
C:\Users\karthik makwana>



For More detail how to use see in Curl/Successfull_Curl.txt dir 




 
