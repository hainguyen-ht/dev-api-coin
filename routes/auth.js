var express = require('express');
var router = express.Router();
const fs = require('fs');
const userPath = "db/user.json"

router.post('/login', function(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    let checkUser = false
    let message = "success"
    console.log(req.body);

    if(email.trim().length == 0 || password.trim().length == 0){
        message = 'all data not null'
        res.send({result: false, message: message})
    }

    fs.readFile(userPath, 'utf8', function (err, data) {
        if (!err) {
            data = JSON.parse(data);
            user = data.filter((item) => {
                return item.email == email && item.password == password
            })
            if(user.length > 0){
                checkUser = true
            }else{
                message = "email or password invalid!"
            }
        } else {
            console.error(err);
            message = error
            res.send({result: false, message: message})
        }
        res.send({result: checkUser, message: message})
    })
});

router.post('/register', function(req, res, next) {
    try{
        console.log('start register account')
        let email = req.body.email;
        let password = req.body.password;
        let fullname = req.body.fullname;        
        let checkRegister = true;
        let message = "success"

        if(!email || !password || !fullname || email.trim().length == 0 || password.trim().length == 0 || fullname.trim().length == 0){
            message = 'all data not null'
            return res.send({result: false, message: message})
        }
        fs.readFile(userPath, 'utf8', function (err, data) {
            if (!err) {
                users = JSON.parse(data);
                
                user = users.filter((item) => {
                    return item.email == email
                })
                if(user.length > 0){
                    console.log('email already exists')
                    checkRegister = false
                    message = "email already exists"
                }else{
                    user = {
                        id: Math.random(),
                        email: email,
                        password: password,
                        fullname: fullname
                    }
                    try{
                        appendData = new Array(...users, user)
                        console.log('appendData')
                        console.log(appendData)
                        fs.writeFileSync(userPath, JSON.stringify(appendData), 'utf8');
                        message = "register success"
                        console.log('end insert data to json file')
                        return res.send({result: checkRegister, message: message})
                    }catch(error){
                        return res.send({result: false, message: "can not write file"})
                    }
                    
                }
            } else {
                console.error(err);
                message = error
                return res.send({result: false, message: message})
            }
            return res.send({result: checkRegister, message: message})
        })
    }catch(e){
        console.log('end register account')
        return res.send({result: false, message: "Bad request"})
    }
    
});

module.exports = router;
