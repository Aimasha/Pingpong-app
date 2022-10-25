import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { FaTrashAlt } from "react-icons/fa";


function App() {
  const [players, setPlayers] = useState([
    {
      name: '',
      points: '',
    },
  ]);
  const [player, setPlayer] = useState({
    name: '',
    points: '',
  });

  const [secondRound, setSecondRound] = useState(false);
  const [leaderBoard, setLeaderBoard] = useState([]);

  // Here I'm getting all the players from server 

  useEffect(() => {
    fetch('/players').then(res => {
      if (res.ok) {
        return res.json();
      }
    }).then(data => setPlayers(data))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayer(prev => {
      return (
        {
          ...prev,
          [name]: value
        })
    })
  }
   // The adding new player function is working  

  const handleNewPlayer = (e) => {
    e.preventDefault();
    alert("a new player added")
    const newPlayer = {
      name: player.name,
      points: player.points,
    }

    axios.post('/newPlayer', newPlayer);
    setPlayer({
      name: '',
      points: '',
    })


    // Delete function for players is working 
  }
  const handleDelete = (_id) => {
    axios.delete('/delete/' + _id)
    alert("player was deleted")
  }

// Handleplay could be improved now I'm getting the updated points of player and showing the winner 
  const handlePlay = async () => {

    await fetch("/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(players)
    });


    let random = (Math.random() * 10).toFixed(0)
    let random2 = (Math.random() * 10).toFixed(0)
    players[0].points = random
    players[1].points = random2

    if (secondRound === false) {
      if (players[0].points === players[1].points) {
        setSecondRound(true)
      }
      if (players[0].points > players[1].points) {
        setLeaderBoard([...leaderBoard, players[0]])
      } else {
        setLeaderBoard([...leaderBoard, players[1]])
      }
    } else {
      if (players[0].points > players[1].points && (players[0].points - players[1].points) > 1) {
        setLeaderBoard([...leaderBoard, players[0]])
        setSecondRound(false)
      } else if (players[1].points > players[0].points && (players[1].points - players[0].points) > 1) {
        setLeaderBoard([...leaderBoard, players[1]])
        setSecondRound(false)
      }
    }

  }
  // console.log('secondRound', secondRound)
  console.log('leaderboard',leaderBoard)


  return (
    <div className="App">
      <h1>Smarttwings Apllication Exercise</h1>
      <form>
        <input onChange={handleChange} name="name" type="text" value={player.name} placeholder="Enter a name" />
        <input onChange={handleChange} name="points" type="text" value={player.points} placeholder="points" />
        <button className="btn" onClick={handleNewPlayer}>ADD Player</button>
      </form>
      {
        players && players.map(player => (
          <div className="wrapper" key={Math.random() * 14000000}>
            <div className="players">
              <p> {player.name}</p>
              <h2 className="point">{player.points}</h2>
              <button className="delete-btn" onClick={() => handleDelete(player._id)}><FaTrashAlt /></button>
            </div>
          </div>
        ))
      }

      <div>
        <button onClick={handlePlay}>Play and find the winner</button>
      </div>

      <div>
        <h1 className="leader">Leaderboard</h1>

        <div className="leaderboard">
          <p>Player's name</p>
          <p>Points</p>
        </div>

        {
          leaderBoard.map((player) => (
            <div >
              <div className="result">
                <p> {player.name} </p>
                <p> {player.points} </p>
              </div>
              <p className="quote"> YEEEE the winner is {player.name} congrats! </p>
            </div>

          ))
        }


      </div>

    </div>
  );
}

export default App;
