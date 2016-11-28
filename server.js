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
//-----------------------------------------------------------------------
// Function: getSummonerID
// Desc: Grabs summoner ID from a summoner name that is given
// Pre: Summoner name must be given
// Post: Return ID if found, else return "Not Found"
//-----------------------------------------------------------------------

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

//did player play with other player?
//grab summoner id of summoner and teamMate
//grab summoner's match history
//see if teamMate's id is in summoner's match history
//if so, true - else, false
//function teamVerification(summoner, teamMate)...


//LolApi.ChampionMastery.getTopChampions(playerId, count (5), callback); - Top 5
//function getTopChamps()...


//LolApi.getLeagueData(summonerId, callback);
//function getLeagueData()...

//verify mastery page token
//ask to your summoner to rename a page name with a token provided by your app and match it after
//function accountVerify()
//LolApi.Summoner.getMasteries(summonerId, callback);


app.get('/test', function (req, res){
    var user = req.query.summoner;
    console.log("User: "+user);
    getSummonerID(user, function(data){
      var id = data;
      if(id == "Not Found"){
          res.send("Player Not Found");
      }
      console.log("User-ID: "+id);
      getMatchHistory(id, function(data){
         res.send(data); 
      });
    });
});

app.listen(process.env.PORT); //C9 requires process.env.PORT