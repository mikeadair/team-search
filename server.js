var express = require('express');
var app = express();
var LolApi = require('leagueapi');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//Release public folder to the world
app.use(express.static('public'));
var path = require('path');

//Developer Key - North America
LolApi.init('RGAPI-b204e665-1d3d-4ecb-bcf8-fb3d9b9ffd97', 'na');

const reqSec = 10;
const reqMin = 500;

LolApi.setRateLimit(reqSec, reqMin);

//Body Parser for POST
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//MongoDB Database Connection
var mongo_user = 'root';
var mongo_pass = 'root';
mongoose.connect('mongodb://'+mongo_user+':'+mongo_pass+'@ds159747.mlab.com:59747/team-search');

//Account Model
var Account = mongoose.model('Account', {email: String, password: String, summoner: String, summonerId: Number, verified: Boolean, confirm: String});

//Session Model
var Session = mongoose.model('Session', {userid: String, epoch: Number});

//Delete Non-Verified Accounts with similar email
function delNonVerEmail(email, callback){
  Account.find({'email': email, 'verified': false}).remove().exec();
}

//Delete Non-Verified Accounts with similar summoner
function delNonVerSummoner(summoner, callback){
  Account.find({'summoner': summoner, 'verified': false}).remove().exec();
}

//Delete Non-Verified Accounts with similar summonerId
function delNonVerSummonerId(summonerId, callback){
  Account.find({'summonerId': summonerId, 'verified': false}).remove().exec();
}

//Get Account by ID
function getAccountById(id, callback){
  Account.find({'_id': id}, function(err, docs){
    if(docs.length == 0){
      callback({'error': 'Account not found with ID.'});
    }else{
      callback(docs[0]);
    }
  });
}

//Find Account with Email/Summoner
function getAccountByUser(user, callback){
  Account.find({'summoner': summoner,'verified': true}, function(err, docs){
    if(docs.length == 0){
      Account.find({'email': email,'verified': true}, function(err, docs){
        if(docs.length == 0){
          callback({'error': 'Account not found with Summoner/Email.'});
        }else{
          callback(docs[0]);
        }
      });
    }else{
      callback(docs[0]);
    }
  });
}

//Checks if email is already being used
function emailInUse(email, callback){
  Account.find({'email': email, 'verified': true}, function(err, docs){
    if(docs.length == 0){
      callback(false);
    }else{
      callback({'error': "Email is already verified for another account."});
    }
  });
}

//Checks if summoner is already being used
function summonerInUse(summoner, callback){
  Account.find({'summoner': summoner, 'verified': true}, function(err, docs){
    if(docs.length == 0){
      callback(false);
    }else{
      callback({'error': "Summoner is already verified for another account."});
    }
  });
}

//Verifies Session
function verifySession(userid, id, callback){
  Session.find({'_id': id, 'userid': userid}, function(err, docs){
    if(docs.length == 0){
      callback({'error': 'Invalid session.'});
    }else{
      if((docs[0]['epoch'] + 27000000) > Date.now()){
        Session.update({'_id': id}, {'epoch': Date.now()}, function(err, docs){});
        callback(true);
      }else{
        Session.find({'_id': id}).remove().exec();
        callback({'error': 'Session has timed-out.'});
      }
    }
  })
}

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

function accountVerify(id, token, callback){
    LolApi.Summoner.getMasteries(id, function(err, data){
      for(var i = 0;i < data[id]['pages'].length;i++){
        if(data[id]['pages'][i]['name'] == token){
          return callback(true);
        }
      }
    return callback({'error': 'Mastery with confirm token not found.'});
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

app.post('/registerUser', function(req, res){
    var confirm = req.body.confirm;
    var id = req.body.id;

    //Make sure queries are sent
    if(!id || !confirm){
        return res.send({"error": "Missing 'confirm' or 'id'."});
    }

    //Make sure Account with ID exists
    getAccountById(id, function(data){
      var email = data['email'];
      var summoner = data['summoner'];
      var summonerId = data['summonerId'];

      if(data['verified'] == true){
        return res.send({'error': 'Account already verified with User.'})
      }

      if(data['error']){
        return res.send(data);
      }else{
        //Make sure Confirm is the same in DB
        if(data['confirm'] === confirm){
          //Make sure Account has Mastery with Token
          accountVerify(data['summonerId'], data['confirm'], function(data){
            if(data['error']){
              return res.send(data);
            }else{
              //Update Account
              Account.update({_id: id}, {'verified': true}, function(err, docs){
                //These must be in here so they fire off after the Update
                //Delete Non-Verified Accounts with Duplicate Values
                delNonVerEmail(email, function(data){})
                delNonVerSummoner(summoner, function(data){})
                delNonVerSummonerId(summonerId, function(data){})
              })
              return res.send({'success': 'User successfully Registered.'});
            }
          })
        }else{
          return res.send({'error': 'Confirm token does not match user in DB.'})
        }
      }
    })
});

app.post('/requestNewAccount', function(req, res) {
    var email = req.body.email;
    var summoner = req.body.summoner;
    var password = bcrypt.hashSync(req.body.password);
    var string = randWord();

    //Make sure queries are sent
    if(!email || !summoner || !password){
        return res.send({"error": "Missing 'email', 'password', or 'summoner'."});
    }

    //Make sure email is valid
    if(!validateEmail(email)){
        return res.send({"error": "Invalid 'email' address."});
    }

    //Make sure password is 6+ Charecters
    if(req.body.password.length < 6){
        return res.send({"error": "Password must be greater than 5 charecters."});
    }

    //Check to see if Email is already being Used
    emailInUse(email, function(data){
      if(data['error']){
        return res.send(data);
      }else{
        //Check to see if Summoner is already being used
        summonerInUse(summoner, function(data){
          if(data['error']){
            return res.send(data);
          }else{
            //Check to see if Summoner Exists
            getSummonerID(summoner, function(data){
                if(data['error']){
                    return res.send(data);
                }
                //Add Account to DB
                var acc = new Account({'email': email, 'password': password, 'summoner': summoner, 'summonerId': data, 'verified': false, 'confirm': string});
                acc.save();
                //Send Confirm String and Account ID
                return res.send({'confirm': string, 'id': acc['_id']});
            })
          }
        })
      }
    })
});

app.post('/login', function(req, res){
  //Can be Email or Summoner
  var user = req.body.user;
  var password = req.body.password;
  getAccountByUser(user, function(data){
    if(data['error']){
      return res.send(data);
    }else{
      if(bcrypt.compareSync(password, data['password'])){
        var session = new Session({'userid': data['_id'], 'epoch': Date.now()});
        acc.save();
        return res.send({'sessionId': session['_id']})
      }else{
        return res.send({'error': 'Incorrect Password.'});
      }
    }
  })
});

app.get('/',function(req, res){
  res.sendfile(path.join(__dirname+'/views/index.html'));
});

app.listen(process.env.PORT || 3000);
