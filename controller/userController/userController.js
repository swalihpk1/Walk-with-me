const ejs = require("ejs");


const home = async (req, res) => {
    try {
        res.render('index');
    } catch (error) {
        console.log(error);
    }
}
const signin = async (req, res) => {
    try {
        res.render('signin');
    } catch (error) {
        console.log(error);
    }
}
const login = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error);
    }
}
const safetymap = async (req, res) => {
    try {
        res.render('safetymap');
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    home,
    signin,
    login,
    safetymap
};