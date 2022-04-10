const express = require("express");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const { open } = require("sqlite");
const path = require("path");
let app = express();
app.use(express.json());
let dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const iniatializingDBandDriver = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server https://localhost:3000/ is running...");
    });
  } catch (error) {
    console.log(`Server error:${error.message}`);
    process.exit(1);
  }
};

iniatializingDBandDriver();

//get api to get all players list
app.get("/players/", async (request, response) => {
  const playersListQuery = `
    select * from cricket_team
    ;`;
  const playersList = await db.all(playersListQuery);
  response.send(playersList);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
    insert into cricket_team (player_name,jersey_number,role)
    values(${playerName},${jerseyNumber},${role});`;

  await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playersListQuery = `
    select * from cricket_team
    where player_id = ${playerId}
    ;`;
  const playersList = await db.all(playersListQuery);
  response.send(playersList);
});

app.put("/players/:playerId/", async (request, response) => {
  const playerDetails = request.body;
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
    update cricket_team set
     (player_name =${playerName},
        jersey_number= ${jerseyNumber},
        role=${role})
    where player_id = ${playerId} ;`;

  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteListQuery = `
    delete  from cricket_team
    where player_id = ${playerId}
    ;`;
  const playersList = await db.run(deleteListQuery);
  response.send("Player Removed");
});

module.exports = app;
