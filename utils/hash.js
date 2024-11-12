const bcrypt = require('bcrypt');


exports.hashPassword_customer = async(plainTxt) => new Promise(async(resolve,reject) => {
    try{
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashed = await bcrypt.hash(plainTxt, salt);
        resolve(hashed);
    }catch(ex){
        console.error("Error hasing the password: " , ex);
        reject(ex);
    }
})
exports.hashPassword_admin = async(plainTxt) => new Promise(async(resolve,reject) => {
    try{
        const saltRounds = 12;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashed = await bcrypt.hash(plainTxt, salt);
        resolve(hashed);
    }catch(ex){
        console.error("Error hasing the password: " , ex);
        reject(ex);
    }
})
