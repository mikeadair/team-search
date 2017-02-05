<template>
    <div class="test">
        <input type="text" v-model="title"><br />
        <h1>{{title}}</h1>
        <p v-if="showName">{{user.first_name}}</p>
        <p v-text="user.last_name"></p>

        <ul>
            <li v-for="item in items">{{item.title}}</li>
        </ul>
        <button v-on:click="greet('Hello World!')">Say Greeting</button>
        <br />
        <input type="text" v-on:keyup="pressKey">

        <hr />
        <label>First Name: </label><input type="text" v-model="user.first_name">
        <label>Last Name: </label><input type="text" v-model="user.last_name">
        <h3>{{fullename}}</h3>

        <h2>{{msg}}
    </div>

</template>


<script>
    export default{
        name: 'test',
        props:{
            msg: {
                type: String,
                default: 'Foobar'
            }
        },
        data(){
            return{
                title: 'Hello',
                user: {
                    first_name: 'John',
                    last_name: 'Doe'
                },
                showName: true,
                items:[
                    {title:'Item One'},
                    {title:'Item Two'},
                    {title:'Item Three'},
                ]
            }
            
        },
        methods:{
            greet: function(greeting){
                alert(greeting);
            },
            pressKey: function(e){
                console.log(e.target.value);
            }
        },
        computed: {
            fullename: function(){
                return this.user.first_name+ ' '+this.user.last_name
            }
        }
    }
</script>

