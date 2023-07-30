// middlewares

const express=require('express');
const morgan=require('morgan');
const mongoose=require('mongoose');
const Blog=require('./models/blog.js');

// express app
const app=express();

const dbURI='mongodb+srv://Aayush_Verma:aayush20215056@nodetut.6f8bmga.mongodb.net/Node';
// const dbURI='mongodb+srv://Aayush_Verma:aayush20215056@nodetut.6f8bmga.mongodb.net/Node?retryWrites=true&w=majority';

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then((res)=>{
        // console.log('done')
        app.listen(3000);
    })
    .catch((err)=>{
        console.log(err);
    });


// regiester view engine
app.set('view engine', 'ejs'); //by default views are saved in views folder
// app.set('views', 'myviews'); to change the save file directory of ejs


// middleware static classes :: files we have to make public
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

app.use(morgan('dev'));

// mongoose and mongo sandbox
// app.get('/add-blog',(req, res)=>{
//     const blog=new Blog({
//         title:'new Blog',
//         snippet: 'about my new blog',
//         body: 'more about my new blog',
//     });

//     blog.save()
//         .then((result)=>{
//             res.send(result);
//         })
//         .catch((err)=>{
//             console.log(err);
//         })
// })

// app.get('/all-blogs', (req, res)=>{
//     Blog.find()
//     .then((result)=>{
//         res.send(result);
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
// })

// app.get('/single-blog', (req, res)=>{
//     Blog.findById('64a1b9244a89a53a3ee8db92')
//     .then((result)=>{
//         res.send(result);
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
// })
app.get('/', (req, res)=>{
    // res.send('<p>Home Page</p>');
    res.redirect('/blogs');
})

app.get('/about', (req, res)=>{
    // res.send('<p>about Page</p>');
    res.render('about', {title:'About'});
})


// blog routs
app.get('/blogs', (req, res)=>{
    Blog.find().sort({createdAt: -1})
    .then((result)=>{
        res.render('index', {title: 'All Blogs', blogs: result})
    })
    .catch((err)=>{
        console.log(err);
    })
}) 

app.post('/blogs', (req,res)=>{
    const blog= new Blog(req.body);
    blog.save()
    .then((result)=>{
        res.redirect('/blogs');
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.get('/blogs/create', (req, res)=>{
    // console.log(req)
    res.render('create', {title:'Create a new Blog'});
})

app.get('/blogs/:id', (req, res)=>{
    const id=req.params.id;
    // console.log(id);
    Blog.findById(id)
    .then(result=>{
        res.render('details', {blog: result, title: 'Blog Details'});
    })
    .catch(err=>{
        console.log(err);
    })
})

app.delete('/blogs/:id', (req, res)=>{
    const id=req.params.id;
    Blog.findByIdAndDelete(id)
    .then(result=>{
        res.json({redirect:'/blogs'})
    })
    .catch(err=>{console.log(err)})
})
// redorects


// 404 page
app.use((req,res)=>{
    res.status(404).render('404', {title:'404'})
}) 