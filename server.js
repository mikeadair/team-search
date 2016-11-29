var express = require('express')
var app = express()
var LolApi = require('leagueapi');

//Release public folder to the world
app.use(express.static('public'))

//Developer Key - North America
LolApi.init('afadd45a-7661-4905-9b78-d66ea2493f8a', 'na');

const reqSec = 10;
const reqMin = 500;

//const timeout = 1000;

LolApi.setRateLimit(reqSec, reqMin);

function getSummonerID(s, callback){
    LolApi.Summoner.getByName(s, "na")
    .then(function (summoner) {
        var id = summoner[s]["id"];
        callback(id);
    }, function(err){
        callback({"error":"Summoner not Found."});
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

function randWord(){
	var arr = ["Ahri", "Akali", "Alistar", "Amumu", "Anivia", "Annie", "Ashe", "Blitzcrank", "Brand", "Caitlyn", "Cassiopeia", "Cho'gath", "Corki", "Dr. Mundo", "Evelynn", "Ezreal", "Fiddlesticks", "Fiora", "Fizz", "Galio", "Gangplank", "Garen", "Gragas", "Graves", "Hecarim", "Heimerdinger", "Irelia", "Janna", "Jarvan IV", "Jax", "Karma", "Karthus", "Kassadin", "Katarina", "Kayle", "Kennen", "Kog'Maw", "LeBlanc", "Lee Sin", "Leona", "Lulu", "Lux", "Malphite", "Malzahar", "Maokai", "Master Yi", "Miss Fortune", "Mordekaiser", "Morgana", "Nasus", "Nautilus", "Nidalee", "Nocturne", "Nunu", "Olaf", "Orianna", "Pantheon", "Poppy", "Rammus", "Renekton", "Riven", "Rumble", "Ryze", "Sejuani", "Shaco", "Shen", "Shyvana", "Singed", "Sion", "Sivir", "Skarner", "Sona", "Soraka", "Swain", "Talon", "Taric", "Teemo", "Tristana", "Trundle", "Trydamere", "Twisted Fate", "Twitch", "Udyr", "Urgot", "Varus", "Vayne", "Veigar", "Viktor", "Vladimir", "Volibear", "Warwick", "Wukong", "Xerath", "Xin Zhao", "Yorick", "Ziggs", "Zilean"];
	return arr[Math.floor((Math.random() * arr.length) + 1)];
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

app.get('/genString', function(req, res) {
    var email = req.query.email;
    var summoner = req.query.summoner;
    var string = randWord();
    
    //Make sure queries are sent
    if(!email || !summoner){
        res.send({"error": "Missing 'email' or 'summoner'."});
        return;
    }
    
    //Make sure email is valid
    if(!validateEmail(email)){
        res.send({"error": "Invalid 'email' address."});
        return;
    }
    
    //Check req.query.email against DB to see if already in use.
    getSummonerID(summoner, function(data){
        var uid = data;
        if(uid['error']){
            res.send(uid);
            return;
        }
        res.send({"string": string, "email": email, "summoner": summoner,"id": uid});    
    });
    //Maybe here we should return the email applied with, string, and account wanted to link.
    //Next step will just be a button that sends all of this info back to us then its checked
    //against accountVerify and added to the DB if success.
});

app.get('/test', function (req, res){
    var summoner = req.query.summoner;
    var teamMate = req.query.teamMate;
    console.log("User: "+summoner);
    console.log("TeamMate: "+teamMate);
    getSummonerID(summoner, function(data){
      var id = data;
      if(id['error']){
          res.send(id);
          return;
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

app.listen(3000);