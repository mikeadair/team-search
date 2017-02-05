<template>
    <div class="users">
        <div class="container">
      <div class="row">
        <div class="Absolute-Center is-Responsive">
          <div class="col-sm-12 col-md-10 col-md-offset-1">
            <center><h2>Noctal.io</h2><img src="../assets/logo.png" height="50px"/></center><hr /><h4>Login</h4>
            <form v-on:submit="login">
                <div class="form-group input-group">
                    <span class="input-group-addon"><i class="glyphicon glyphicon-envelope"></i></span>
                    <input class="form-control" type="text" name='email' v-model="loginUser.email" v-on:keyup="emailVerify" placeholder="Email" />
                </div>
                <div class="form-group input-group">
                    <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                    <input class="form-control" type="password" name='password' v-model="loginUser.password" placeholder="Password" v-on:keyup="passwordVerify"/>
                </div>
                <div class="form-group">
                    <button v-if="emailVerified && passwordVerified" type="button" class="btn btn-def btn-block hvr-shutter-out-horizontal" v-on:click="login">Login</button>
                </div>
                <span style="color:red;">{{err}}</span>
                <span style="color:green;">{{succ}}</span>
                <div class="form-group text-center">
                    <router-link to="/register">Register</router-link>&nbsp;|&nbsp;<a href="#">Forgot Password</a>&nbsp;|&nbsp;<a href="#">Support</a>
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
                loginUser: {},
                passwordMatch: false,
                err: "",
                succ: "",
                emailVerified: false,
                passwordVerified: false
            }
        },
        methods:{ 
            login: function(e){
                const {
                    email,
                    password
                } = this.loginUser
                var that = this
                Axios.post('http://0.0.0.0:3000/login', {
                    email: email,
                    password: password
                })
                .then(function (response) {
                    const{
                        confirm,
                        id,
                        verified,
                        error
                        //token
                    } = response.data
                    if(error != null){
                        that.err = error;
                    }else{
                        if(verified == "false"){
                            
                            that.$router.push({ path: 'verifySummoner', query: { accID: id, confString: confirm }})
                            return
                        }
                        that.err = ""
                        that.succ = "Success!"
                        that.$router.push({ path: 'dashboard'})
                    }
                })
                .catch(function (error) {
                    
                    that.err = "There was an error processing your request, try again..." + error;
                });
                e.preventDefault();
            },
            emailVerify: function(e){
                this.emailVerified = validEmail(e.target.value);
            },
            summonerVerify: function(e){
                if(e.target.value){
                    this.summonerVerified = true
                }else this.summonerVerified = false
                
            },
            passwordVerify: function(e){
                if(e.target.value) this.passwordVerified = true
                else this.passwordVerified = false
            }
        }
    }

function validEmail(e) {
    var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    return String(e).search (filter) != -1;
}
</script>
