//получаем отправленные данные со страницы «Регистрация» create.hbs и добавляем их в БД
app.post("/create", urlencodedParser, function (req, res) {
    
    if(!req.body) return res.sendStatus(400);
    
    const Name = req.body.name;
    const Login = req.body.login;
    const Pass = req.body.pass;

    pool.query("INSERT INTO users (Name, Login, Pass) VALUES (?,?,?)", [Name, Login, Pass], function(err, data) {
        if(err) return console.log(err);
        //пока просто перенаправляем на index.hbs
        res.redirect("/");
        //выводим в консоль в случае успеха
        console.log("В таблицу users добавлен новый пользователь!!!");
    });
    
});