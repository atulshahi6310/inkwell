const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { randomUUID } = require('crypto');
const methodOverride = require('method-override');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method')); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

let posts = [
    {
        id: randomUUID(),
        username: 'John Doe',
        content: 'This is my first post!',
        timestamp: new Date().toLocaleString()
    }
];
app.get('/', (req, res) => {
    res.redirect('/posts');
});

app.get('/posts', (req, res) => {
  res.render('index.ejs', { posts });
});

app.get('/posts/new', (req, res) => {
    
    res.render('new-post.ejs');
});

app.post('/post',(req,res)=>{
    let {username, content} = req.body;
    let newPost = {
        id: randomUUID(),
        username,
        content,
        timestamp: new Date().toLocaleString()
    };
    posts.push(newPost);
    res.redirect('/posts');
});

app.get('/posts/:postid', (req, res) => {
    let { postid } = req.params;
    let post = posts.find(p => p.id === postid);
    console.log(post)
    res.render('show.ejs', { post });
});


app.patch('/posts/:postid', (req, res) => {
    let { postid } = req.params;
    let newContent = req.body.content;
    let post = posts.find(p => p.id === postid);
    post.content = newContent;
    res.redirect('/posts');
});

app.delete('/posts/:postid', (req, res) => {
    let { postid } = req.params;
    posts = posts.filter(p => p.id !== postid);
    res.redirect('/posts');
});

// Export for Vercel serverless
module.exports = app;

// Listen locally when not on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}