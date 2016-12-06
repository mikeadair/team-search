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
	var arr = ["Abyssal","Scepter","Aegis","Legion","Aether","Wisp","Amplifying","Tome","Ancient","Coin","Arcane","Sweeper","Arcane","Sweeper","Archangels","Staff","Archangels","Staff","Quick","Charge","Ardent","Censer","Athenes","Unholy","Grail","Sword","Bamis","Cinder","Banner","Command","Banshees","Veil","Berserkers","Greaves","Bilgewater","Cutlass","Blade","Ruined","King","Blasting","Wand","Boots","Mobility","Boots","Speed","Boots","Swiftness","Brawlers","Gloves","Catalyst","Aeons","Caulfields","Warhammer","Chain","Vest","Chalice","Harmony","Cloak","Agility","Cloth","Armor","Control","Ward","Corrupting","Potion","Crystalline","Bracer","Cull","Dagger","Dead","Mans","Plate","Deaths","Dance","Deaths","Daughter","Dervish","Blade","Diet","Poro-Snax","Dorans","Blade","Dorans","Ring","Dorans","Shield","Duskblade","Draktharr","Edge","Night","Elixir","Iron","Elixir","Sorcery","Elixir","Wrath","Entropy","Field","Essence","Reaver","Executioners","Calling","Explorers","Ward","Equinox","Oasis","Watchers","Face","Mountain","Faerie","Charm","Farsight","Alteration","Fiendish","Codex","Fire","Will","Flash","Zone","Forbidden","Idol","Frost","Queens","Claim","Frostfang","Frozen","Heart","Frozen","Mallet","Giant","Slayer","Giants","Belt","Glacial","Shroud","Golden","Transcendence","Golden","Transcendence","Disabled","Greater","Stealth","Totem","Trinket","Greater","Vision","Totem","Trinket","Guardian","Angel","Guardians","Hammer","Guardians","Horn","Guardians","Guinsoos","Rageblade","Haunting","Guise","Health","Potion","Hexdrinker","Hextech","GLP-800","Hextech","Gunblade","Hextech","Protobelt-01","Hextech","Revolver","Hunters","Machete","Hunters","Potion","Hunters","Talisman","Iceborn","Gauntlet","Infinity","Edge","Ionian","Boots","Lucidity","Jaurims","Fist","Kindlegem","Kircheis","Shard","Knights","Last","Whisper","Liandrys","Torment","Lich","Bane","Locket","Iron","Solari","Long","Sword","Lord","Dominiks","Regards","Lord","Damms","Pillager","Lost","Chapter","Ludens","Echo","Manamune","Manamune","Quick","Charge","Malmortius","Mejais","Soulstealer","Mercurial","Scimitar","Mercurys","Treads","Mikaels","Crucible","Moonflair","Spellblade","Morellonomicon","Mortal","Reminder","Muramana","Muramana","Nashors","Tooth","Needlessly","Large","Negatron","Cloak","Nexus","Siege:","Siege","Weapon","Slot","Ninja","Tabi","Nomads","Medallion","Null-Magic","Mantle","Ohmwrecker","Oracle","Alteration","Oracles","Extract","Overlords","Bloodmail","Perfect","Core","Phage","Phantom","Dancer","Pickaxe","Poachers","Dirk","Poro-Snax","Port","Prototype","Core","Quicksilver","Sash","Rabadons","Deathcap","Raise","Morale","Randuins","Omen","Rapid","Firecannon","Raptor","Cloak","Ravenous","Hydra","Recurve","Redemption","Refillable","Potion","Rejuvenation","Bead","Relic","Shield","Righteous","Glory","Ages","Ages","Quick","Charge","Ruby","Crystal","Ruby","Sightstone","Runaans","Hurricane","Rylais","Crystal","Scepter","Sanguine","Blade","Sapphire","Crystal","Seekers","Armguard","Seer","Stone","Trinket","Seer","Stone","Trinket","Seraphs","Embrace","Seraphs","Embrace","Serrated","Dirk","Sheen","Shield","Totem","Siege","Ballista","Siege","Refund","Siege","Sight","Warder","Siege","Teleport","Siege","Teleport","Siege","Teleport","Inactive","Sightstone","Skirmishers","Sabre","Sorcerers","Shoes","Soul","Anchor","Trinket","Spectres","Cowl","Spellthiefs","Edge","Spirit","Visage","Stalkers","Blade","Statikk","Shiv","Steraks","Gage","Stinger","Sunfire","Cape","Sweeping","Lens","Trinket","Talisman","Ascension","Targons","Brace","Tear","Goddess","Tear","Goddess","Quick","Charge","Black","Cleaver","Black","Spear","Bloodthirster","Dark","Seal","Core","mk-1","Core","mk-2","Lightbringer","Thornmail","Tiamat","Titanic","Hydra","Total","Biscuit","Rejuvenation","Total","Biscuit","Rejuvenation","Tower:","Beam","Ruination","Tower:","Storm","Bulwark","Trackers","Knife","Trinity","Force","Vampiric","Scepter","Vanguard","Banner","Void","Staff","Wardens","Mail","Warding","Totem","Trinket","Warmogs","Armor","Wicked","Hatchet","Wits","Wooglets","Witchcap","Youmuus","Ghostblade","Zeal","Zekes","Harbinger","Zhonyas","Hourglass","ZzRot","Portal"];
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

app.listen(process.env.PORT);