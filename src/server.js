const app = express();

app.use(express.static(__dirname+'/dist/rcywmfront'));
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/dist/rcywmfront/index.html'));
});

app.listen(process.env.PORT || 8080);