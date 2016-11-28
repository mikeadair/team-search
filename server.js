var express = require('express')
var app = express()
var LolApi = require('leagueapi');

//Release public folder to the world
app.use(express.static('public'))

//Developer Key - North America
LolApi.init('afadd45a-7661-4905-9b78-d66ea2493f8a', 'na');

const reqSec = 10;
const reqMin = 500;

const timeout = 1000;

LolApi.setRateLimit(reqSec, reqMin);

function getSummonerID(s, callback){
    LolApi.Summoner.getByName(s, "na")
    .then(function (summoner) {
        var id = summoner[s]["id"];
        callback(id);
    }, function(err){
        callback("Not Found");
    });
}

function getScore(id, callback){
    LolApi.ChampionMastery.getScore(id)
    .then(function (summoner) {
       var score = summoner;
       callback(score); 
    });
}

function getMatchHistory(id, callback){
    LolApi.getRecentGames(id)
    .then(function (summoner){
        var recent = summoner;
        callback(recent);
    });
}

//checks last 10 games
function teamVerification(sID, tID, callback){
    getMatchHistory(sID, function(matches){
        if(JSON.stringify(matches).indexOf(tID) > -1){
            callback(true);
        }else{
            callback(false);
        }
    });
}


//doesnt work
function getTopChamps(id, callback){
    LolApi.ChampionMastery.getTopChampions(id, "3", "na", function(data){
       callback(data); 
    });
}


//LolApi.getLeagueData(summonerId, callback);
//function getLeagueData()...



function accountVerify(id, token, callback){
    LolApi.Summoner.getMasteries(id, function(data){
        if(JSON.stringify(data).indexOf(token) > -1){
            callback(true);
        }else{
            callback(false);
        }
    });
}



app.get('/test', function (req, res){
    var user = req.query.summoner;
    var teamMate = req.query.teamMate;
    console.log("User: "+user);
    console.log("TeamMate: "+teamMate);
    getSummonerID(user, function(data){
      var id = data;
      if(id == "Not Found"){
          res.send("Player Not Found");
      }
      console.log("User-ID: "+id);
      getTopChamps(id, function(data){
         console.log("Top champs: "+data); 
      });
      getSummonerID(teamMate, function(data){
          var tid = data;
          console.log("tid: " +tid);
          teamVerification(id, tid, function(data){
             console.log("Did I play with this player? " + data); 
          });
      });
      getMatchHistory(id, function(data){
         res.send(data); 
      });
    });
});

app.listen(process.env.PORT); //C9 requires process.env.PORT