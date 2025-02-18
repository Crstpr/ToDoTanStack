const router = require('express').Router();
const pool = require('../db');
const { customAlphabet } = require('nanoid');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validInfo');
const authorization = require('../middleware/authorization');

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 21);
//register
router.post('/register', validInfo, async(req, res) => {
    try {

        const { username, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if(user.rows.length !== 0){
            return res.status(401).send('User already exists');
        }

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);


        const id = nanoid();

        const newUser = await pool.query(
            "INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING *",
            [id, username, bcryptPassword]
        );

        const token = jwtGenerator(newUser.rows[0].id);
        res.json({ token });   
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//login route
router.post('/login', validInfo, async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if(user.rows.length === 0){
            return res.status(401).json('Invalid credentials!');
        }
        
        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if(!validPassword){
            return res.status(401).json('Invalid credentials!');
        }

        const token = jwtGenerator(user.rows[0].id);

        res.json({ token });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

});

router.get("/is-verify",authorization, async(req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

module.exports = router;