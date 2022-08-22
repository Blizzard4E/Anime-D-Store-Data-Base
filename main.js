const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://ChoungPheng:HFqux35cRxzLP9to@cluster0.cpyldyi.mongodb.net/animedstore?retryWrites=true&w=majority', 
    {
        useNewUrlParser: true
    },() => {
        console.log("Connected to MongoDB Database");
    }
);

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    history: [
        {
            id: {
                type: Number,
                require: true
            },
            size: {
                type: Number,
                require: true
            },
            qty: {
                type: Number,
                require: true
            },
            date: {
                type: String,
                require: true
            },
            require: false
        }
    ]
})

const User = mongoose.model('user', UserSchema);

app.listen(3000, () => {
    console.log("Listening on port 3000...");
})

app.get('/', (req, res) => {
    res.send("You are on Anime D. Store API")
});

app.get('/users', (req, res) => {
    res.send("You are on Anime D. Store API")
});

app.get('/users/:email', (req, res) => {
    User.findOne( { email: req.params.email } , (err, user) => {
        res.send(user);
    })
});

app.post('/signIn', (req, res) => {

    let newUser = new User({
        email: req.body.email,
        history: []
    });
    console.log(req.body);

    User.findOne( { email: newUser.email } , (err, user) => {
        if(user != null) {
            res.send("User already exist!");
        }
        else {
            newUser.save();
            res.send("User created!");
        }
    });

});

app.post('/addItemToUser/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body);
    User.findOne( { email: req.body.email } , (err, user) => {
        let items = req.body.items;
        console.log(items);
        if(user != null) {
            
            let updatedUser = {
                email: req.body.email,
                history: user.history
            }
            items.forEach(item => {
                updatedUser.history.push(item); 
            });
            console.log(updatedUser);
            User.findOneAndUpdate( user, updatedUser , (err, user2) => {
                res.send('Updated user!');
            });
        }
        else {
            res.send("User not found!");
        }
    });;
});