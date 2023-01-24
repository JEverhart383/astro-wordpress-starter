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
    <section v-if="jwt">
        <h3>Create Post</h3>
        <QuillEditor theme="snow" v-model:content="content" content-type="html"/>
        <br>
        <button type="button" @click="createDraftPost">Create New Post</button>
    </section>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
export default {
    data() {
        return {
            username: '',
            password: '',
            jwt: '',
            posts: [],
            content: ''
        }
    },
    components: {
        QuillEditor
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
                                databaseId
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
            
        },
        async createDraftPost(){
            const authResponse = await fetch(this.url, {
                    method: 'post', 
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization': `Bearer ${this.jwt}`
                    },
                    body: JSON.stringify({
                        query: `
                        mutation MyMutation {
                            createPost(input: {content: "Test", title: "Test", status: DRAFT, authorId: "1"}) {
                                post {
                                title
                                content
                                }
                            }
                        }
                        `
                    })
                });
        }

        
    },
    updated () {
        console.log(this.content)
    }
}

</script>

<style>
form input {
    display: block;
}

</style>