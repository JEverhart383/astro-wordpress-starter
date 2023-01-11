<template>
    <form action="" v-on:submit="loginAndFetch">
        <label for="usernameInput">Username</label>
        <input type="text" name="username" v-model="username" id="usernameInput">
        <label for="passwordInput">Password</label>
        <input type="password" name="password" v-model="password" id="passwordInput">
        <button type="submit">Login</button>
    </form>
    <section>
        <h3>Draft Posts</h3>
        <ul>
            <li v-for="post in posts" :key="post.title">{{post.title}}</li>
        </ul>
    </section>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            password: '',
            jwt: '',
            posts: []
        }
    },
    props: {
        url: {
            type: String,
            required: true
        }
    },
    methods: {
        async loginAndFetch(e){
            e.preventDefault();
            console.log('Logging in user...');
            const response = await fetch(this.url, {
                method: 'post', 
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    query: `
                    mutation LoginUser {
                        login( input: {
                            clientMutationId: "uniqueId",
                            username: "${this.username}",
                            password: "${this.password}"
                        }){
                            authToken
                            user {
                                id
                                name
                            }
                        }
                    }
                    `
                })
            });
            const { data } = await response.json();
            console.log(data)

            if (data?.login?.authToken){
                console.log('Fetching auth content...');
                this.jwt = data.login.authToken;
                const authResponse = await fetch(this.url, {
                    method: 'post', 
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization': `Bearer ${this.jwt}`
                    },
                    body: JSON.stringify({
                        query: `
                        query getAllPosts {
                            posts(where: {status: DRAFT}) {
                                nodes {
                                    title
                                }
                            }
                        }
                        `
                    })
                });
                const authData = await authResponse.json();
                this.posts = authData?.data?.posts?.nodes
                console.log(authData);
            }
            
        }
    }
}









//0JW1s)z$OYgVs7TKr)TgTH4U
</script>

<style>
form input {
    display: block;
}

</style>