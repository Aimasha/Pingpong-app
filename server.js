const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const { MONGO_URI } = process.env;
const port = process.env.PORT || 4002;

app.use(bodyParser.json());
app.use(cors());

//mongoose
mongoose.connect(MONGO_URI)


//data schema and model
const playerSchema = {
    name: String,
    points: String,
}

const leaderPlayerSchema = {
    name: String,
    points: String,
}



const Player = mongoose.model("Players", playerSchema);
const LeaderPlayer = mongoose.model("Leaders", leaderPlayerSchema);

//api routes
app.get('/players', (req, res) => {
    Player.find().then(players => res.json(players))
})

app.post('/newPlayer', (req, res) => {
    const name = req.body.name;
    const points = req.body.points;
    const newPlayer = new Player({
        name,
        points
    })
    newPlayer.save();
})
// app.put('/update', (req, res) => {
//     Player.findByIdAndUpdate({_id:req.body[0]._id},
//         {
//            points: req.body[0].points
//         },
//     )
//     Player.findByIdAndUpdate({_id:req.body[1]._id},
//         {
//            points: req.body[1].points
//         },

//     )
//     console.log(req.body[0].points)
//     console.log(req.body[1].points)
//     res.send("updated")
// })

app.put('/update/:_id', (req, res) => {
    Player.findOneAndUpdate(
        {
            _id: req.body[0]._id
        },
        {
            points: req.body[0].points
        },
    )
    Player.findOneAndUpdate(
        {
            _id: req.body[1]._id
        },
        {
            points: req.body[1].points
        },
        res.send("updated")
    )

})

app.delete('/delete/:_id', (req, res) => {
    Player.findByIdAndDelete({ _id: req.params._id }, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("player deleted", data)
        }
    })
})

app.listen(port, () => {
    console.log("express is running on " + ` ${port}`)
})
