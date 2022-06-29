const express = require('express');   
const bodyParser = require('body-parser');
const fs = require('fs');

const port = process.env.PORT ?? 3000;
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) =>{
    res.render('index');
});

app.get('/reg', (req, res) =>{
    res.render('reg');
});

app.get('/aut', (req, res) =>{
    res.render('aut');
});;
app.get('/aut-s', (req, res) =>{
    res.render('aut-successfull');
});;

app.post('/reg', urlencodedParser, (req, res) =>{
    const stringDataName = JSON.stringify(req.body.username);
    const stringData = JSON.stringify(req.body);
    fs.readFile('data.txt', (err, data) => {
        if (data.toString().includes(stringDataName)) {
            res.render('reg-failed');
        } else {
            fs.appendFile('data.txt', stringData + '\n', () => {
                res.render('aut');
            });
        };
    });
});

app.post('/aut', urlencodedParser, (req, res) =>{
    const stringDataName = req.body.username;
    const stringDataPass = req.body.userpass;
    let flag = true;
    fs.readFile('data.txt', (err, data) => {
        var usersData = data.toString().split(/(?={")/).map(x => JSON.parse(x));
        usersData.forEach(el => {
            if (el.username == stringDataName && el.userpass == stringDataPass){
                res.render('aut-successfull', {data: el});
                flag = false;
                return;
            };
        });
        if (flag){
            res.render('aut-failed');
        };
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен http://localhost:${port}`);
});

