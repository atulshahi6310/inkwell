const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { v4 : uuidv4 } = require('uuid');
const methodOverride = require('method-override');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

let posts = [
    {
        id: uuidv4(),
        username: 'John Doe',
        content: 'This is my first post!',
        timestamp: new Date().toLocaleString()
    }
];
app.get('/posts', (req, res) => {
  res.render('index.ejs', { posts });
});

app.get('/posts/new', (req, res) => {
    
    res.render('new-post.ejs');
});

app.post('/post',(req,res)=>{
    let {username, content} = req.body;
    let newPost = {
        id: uuidv4(),
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
    console.log(post)
   res.redirect('/posts');

})


app.get('/posts/:postid/edit', (req, res) => {
    let { postid } = req.params;
    let post = posts.find(p => p.id === postid);
    res.render('edit.ejs', { post });
    
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});