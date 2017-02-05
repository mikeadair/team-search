<template>
    <div class="users">
        <div class="container">
      <div class="row">
        <div class="Absolute-Center is-Responsive">
          <div class="col-sm-12 col-md-10 col-md-offset-1">
            <center><h2>Noctal.io</h2><img src="../assets/logo.png" height="50px"/></center><hr /><h4>Verify</h4>
            <form v-on:submit="verifyUser">
                <p>Please login into your Leauge of Legends account, navigate to your mastery pages, and add or rename a mastery page called: {{confirm}}</p>
                <div class="form-group">
                    <button type="submit" class="btn btn-def btn-block hvr-shutter-out-horizontal">Verify</button>
                    <br /><br />
                    <p style="color: red">{{err}}</p>
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
        data(){
            return{
                confirm: getQueryVariable('confString'),
                id: getQueryVariable('accID'),
                err: "",
                succ: ""
            }
        },
        methods:{ 
            verifyUser: function(e){
                const {
                    id,
                    confirm,
                } = this
                const that = this;
                Axios.post('http://0.0.0.0:3000/registerUser', {
                    confirm: confirm,
                    id: id
                })
                .then(function (response) {
                    that.err = response.data.error;
                })
                .catch(function (error) {
                    that.err = "Server error, try again!";
                });
                e.preventDefault();
            }
        }
    }

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
</script>
