const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const fs = require('fs');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = low(new FileSync('db.json'));
db.defaults({ comments: [] }).write();

app.get('/', (req, res) => {
    const header = fs.readFileSync('content/header.html', 'utf8');
    const footer = fs.readFileSync('content/footer.html', 'utf8');

    const comments = db.get('comments').value();
    let content = '';
    for (var i = 0; i < comments.length; i++) {
        content += `<p>${comments[i].name}</p><p>${comments[i].text}</p><br>`;
    }

    res.send(header + content + footer);
});

app.post('/post_comment', (req, res) => {
    db.get('comments').push(req.body).write();
    res.redirect('/');
});

app.listen(3000);
