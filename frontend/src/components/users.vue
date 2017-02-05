<template>
    <div class="users">
        <div class="container">
      <div class="row">
        <div class="Absolute-Center is-Responsive">
          <div class="col-sm-12 col-md-10 col-md-offset-1">
            <center><h2>Noctal.io</h2><img src="../assets/logo.png" height="50px"/></center><hr /><h4>Registration</h4>
            <form v-on:submit="addUser">
                <div class="form-group input-group">
                    <span class="input-group-addon"><i class="glyphicon glyphicon-envelope"></i></span>
                    <input class="form-control" type="text" name='email' v-model="newUser.email" v-on:keyup="emailVerify" placeholder="Email" />
                </div>
                <div class="form-group input-group">
                    <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                    <input class="form-control" type="text" name='summonerName' v-model="newUser.summoner" v-on:keyup="summonerVerify" placeholder="Summoner Name" />
                </div>
                <div class="form-group input-group">
                    <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                    <input class="form-control" type="password" name='password' v-model="newUser.password" placeholder="Password" />
                </div>
                <div class="form-group input-group">
                    <span class="input-group-addon"><i class="glyphicon glyphicon-check"></i></span>
                    <input class="form-control" type="password" name='password' v-model="newUser.passwordConf" v-on:keyup="passwordVerify" placeholder="Type Password Again" />
                </div>
                <div class="form-group">
                    <button v-if="passwordMatch && emailVerified && summonerVerified" type="button" class="btn btn-def btn-block hvr-shutter-out-horizontal" v-on:click="addUser">Register</button>
                </div>
                <span style="color:red;">{{err}}</span>
                <span style="color:green;">{{succ}}</span>
                <div class="form-group text-center">
                    <router-link to="/login">Login</router-link>&nbsp;|&nbsp;<a href="#">Forgot Password</a>&nbsp;|&nbsp;<a href="#">Support</a>
                </div>
                <div class="form-group text-center">
                    <p id="onlineUsers">50,000 Users Online</p>
                </div>
            </form>
            </div>
          </div>  
        </div>    
      </div>
    </div>

</template>


<script>
    import Axios from 'axios'

    export default{
        name: 'users',
        data(){
            return{
                newUser: {},
                passwordMatch: false,
                err: "",
                succ: "",
                emailVerified: false,
                summonerVerified: false
            }
        },
        methods:{ 
            addUser: function(e){
                const {
                    email,
                    summoner,
                    password,
                } = this.newUser
                var that = this
                
                Axios.post('http://0.0.0.0:3000/requestNewAccount', {
                    email: email,
                    summoner: summoner,
                    password: password
                })
                .then(function (response) {
                    const{
                        error,
                        confirm,
                        id
                    } = response.data
                    if(error != null){
                        that.err = error;
                    }else{
                        that.err = ""
                        that.succ = "Account Created!"
                        that.$router.push({ path: 'verifySummoner', query: { accID: id, confString: confirm }})
                    }
                })
                .catch(function (error) {
                    that.err = "There was an error processing your request, try again..." + error;
                });
                e.preventDefault();
            },
            passwordVerify: function(e){
                if(this.newUser.password == e.target.value) this.passwordMatch = true
                else this.passwordMatch = false
            },
            emailVerify: function(e){
                this.emailVerified = validEmail(e.target.value);
            },
            summonerVerify: function(e){
                if(e.target.value){
                    this.summonerVerified = true
                }else this.summonerVerified = false
                
            }
        }
    }

function validEmail(e) {
    var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    return String(e).search (filter) != -1;
}
</script>
