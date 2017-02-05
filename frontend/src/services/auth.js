import {router} from '../main.js'

export default {

    // authentication status
    authenticated: false,

    // Send a request to the login URL and save the returned JWT
    login(context, creds, redirect) {
        context.$http.post('/api/login', creds, (data) => {
            localStorage.setItem('user', JSON.stringify(data))

            this.authenticated = true
            context.$root.user = data

            // Redirect to a specified route
            if (redirect) {
                router.go(redirect)
            }

        }).error((errors) => {
            context.errors = errors;
        })
    },

    // To log out
    logout: function() {
        localStorage.removeItem('user');
        this.authenticated = false;
        router.go('/login')
    }
}