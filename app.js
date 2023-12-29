const mysql = require("mysql2"); //подключаем БД
const express = require("express"); //подключаем фреймворк express
const app = express(); //создаем объект приложение
const urlencodedParser = express.urlencoded({extended: false});
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
const bcrypt = require("bcryptjs"); //для генерации hash-пароля + надо еще использовать salt
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy; // подключаем passpоrt и стратегию
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const { log } = require("handlebars");
// создаем парсер для данных в формате json

const port = 3000;
const secretKey = "secret";
let opts = {}; // создаем параметры для работы стратегии c 2 параметрами
opts.jwtFromRequest = ExtractJwt.fromBodyField("jwt"); //берем из тела реквеста token
opts.secretOrKey = secretKey;
//создаем стратегию
passport.use(new JwtStrategy(opts,(jwt_payload, done) => {
    return done(null, jwt_payload.login);
}));
// создаем парсер для данных в формате json
const bodyParser = express.json();

//парсер URL – разбирает URL 
//создаем пул подключений к нашему серверу
const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost", //наш хостинг
    user: "root", //логин к нашей базе
    database: "football", //наша база football, созданная в прошлой работе
    password: "" //пароль к нашей базе
});


// Сообщаем Node, где лежат ресурсы сайта
app.use(express.static(__dirname + '/public'));
//устанавливаем Handlebars в качестве движка представлений в Express
app.set("view engine", "hbs");


// ===================================================
// РЕГИСТРАЦИЯ В БАЗЕ football В ТАБЛИЦЕ users
// ===================================================
// получаем отправленные данные из формы - post(1 параметр маршрут, 2 распарсивание запроса, 3 функция)
app.post("/create", urlencodedParser, function (req, res) {

    try {

        if(!req.body) {
            console.log("Ошибка при регистрации", err);
            return res.sendStatus(400);
        }
        //проверяем на дубль
        pool.query("SELECT `Name`, `login` FROM users WHERE `Name` = '" +
            req.body.name + "' OR Login = '" + req.body.login +"'", 
            (err, rows)=> {
                
                if(err) {
                    res.status(400);
                    console.log("Ошибка при чтении из бд", err);
                } 
                else if (typeof rows !== 'undefined' && rows.length > 0) {
                    //простой вывод в окно строки
                    //res.send(`Пользователь с таким именем - ${req.body.name} уже зарегистрирован!`);

                    //заглушка на случай если уже есть в базе такой name и login
                    //как вариант - можно sendFile страницы из Public и уже оттуда ссылку на регистрацию

                    console.log('есть в бд')
                    // res.redirect("/createfault");
                    res.sendStatus(409);
                    return true;

                // если нет дубля, добавляем пользователя в БД
                } 
                else if (req.body.name.length == 0 || req.body.login == 0 || req.body.pass == 0) {
                    console.log('Пустые поля')
                    // res.redirect("/createfault");
                    res.sendStatus(400);
                    return true;
                }
                else {
                    const Name = req.body.name;
                    const Login = req.body.login;
                    //const Pass = req.body.pass; //было до использования bcrypt
                    //const {Name, Login, Pass} = req.body; //можно сразу и всех, а не по отдельности
                    //генерируем hash-пароль из переданного пороля в реквесте
                    const salt = bcrypt.genSaltSync(7) //чем больше число, тем дольше генерации
                    const Pass = bcrypt.hashSync(req.body.pass, salt) //в БД надо поле для пароля увеличить
                    //параметризация
                    pool.query("INSERT INTO users (Name, Login, Pass) VALUES (?,?,?)", 
                        [Name, Login, Pass], 
                        function(err, data) {
                            if(err) return console.log(err);
                            //? надо сделать страницу успеха с описанием возможности отзывов
                            //например так res.sendFile(__dirname + "/success.html") и там уже ссылка/переход на ..главную?;
                            //пока просто редирект на главную

                            console.log(`LoginLogin = ${Login}`);
                            pool.query("SELECT * FROM users WHERE `Login` = '"+ Login +"'",
                                (err, result)=> {
                                    if (err) {
                                        res.sendStatus(400);
                                        console.log("Ошибка при чтении из бд", err);
                                    } 
                                    else if(result.length <=0) {
                                        //простой вывод в окно строки
                                        //res.send(`Пользователь с таким именем - ${req.body.login} в базе не найден! пройдите на регистрацию`);
                                        //заглушка на случай если уже есть в базе такой name и login
                                        console.log(`пользователя ${req.body.login} нет в бд`);
                                        //и если пользователя нет, перенаправляем на регистрацию ...можно также через страницу-заглушку в public
                                        //рабочий редирект - на время теста был
                                        // res.redirect("/create")                    
                                        res.sendStatus(401);
                                        //return true;
                                        //если есть, проверяем пароль введенного пользователя (login) с hash-паролем изБД
                                    
                                    } 
                                    else {
                                        //console.log(`пароль из запроса ${req.body.pass}`);
                                        //console.log(result);
                                        //перевод из Object в JSON, чтоб передать hash User в
                                        const row = JSON.parse(JSON.stringify(result));
                                        row.map(rw => {
                                            console.log(`rw = ${rw.Name}`);
                                            const token = jwt.sign({
                                                id_user: rw.ID,
                                                login: rw.Login}, secretKey, { expiresIn: '1h' }); //можно просто "1h" и т.п.
                                            
                                            res.status(200).json({name: rw.Name, token: `${token}`});
                                            //"Ок, пароль верный"`);
                                            console.log(`Пользователь с таким именем -
                                                ${Login} зарегистрирован в бд, токен +!`);
                                            return true
                                        })
                                    };
                                }
                            );

                            // res.redirect("/");
                            console.log("Добавили пользователя в базу");
                        }
                    )
                }
            })

    } 
    catch (e) {
        console.log(e);
        res.status(400).send('Registration error');
    }

});

// ====================================================================
// АВТОРИЗАЦИЯ НА САЙТЕ ПО ИМЕЮЩЕЙСЯ ИНФОРМАЦИИ В БАЗЕ В ТАБЛИЦЕ users
// ====================================================================
// получаем отправленные данные из формы
app.post("/avtoriz", urlencodedParser, function (req, res) {
    try {

        if(!req.body) {
            console.log("Ошибка в запросе", err);
            return res.sendStatus(400);
        }

        console.log(`${req.body.login}`);
        //берем из базы данные по Login
        pool.query("SELECT * FROM users WHERE `Login` = '"+ req.body.login +"'",
            (err, result)=> {
                if (err) {
                    res.sendStatus(400);
                    console.log("Ошибка при чтении из бд", err);
                } 
                else if (req.body.login.length == 0 || req.body.pass.length ==0) {
                    console.log(`Пустые поля`);
                    res.sendStatus(400);
                }
                else if(result.length <=0) {
                    //простой вывод в окно строки
                    //res.send(`Пользователь с таким именем - ${req.body.login} в базе не найден! пройдите на регистрацию`);
                    //заглушка на случай если уже есть в базе такой name и login
                    console.log(`пользователя ${req.body.login} нет в бд`);
                    //и если пользователя нет, перенаправляем на регистрацию ...можно также через страницу-заглушку в public
                    //рабочий редирект - на время теста был
                    // res.redirect("/create")                    
                    res.sendStatus(401);
                    //return true;
                    //если есть, проверяем пароль введенного пользователя (login) с hash-паролем изБД
                
                } 
                else {
                    //console.log(`пароль из запроса ${req.body.pass}`);
                    //console.log(result);
                    //перевод из Object в JSON, чтоб передать hash User в
                    bcrypt.compareSync
                    const row = JSON.parse(JSON.stringify(result));
                    row.map(rw => {
                        //const passwords = req.body.Pass; //простое сравнивание пароля полученного из реквеста с БД без крипто
                        //if(passwords == result.pass) { //простое сравнивание пароля полученного из реквеста с БД
                        //сравнение hash-пароля из запроса и полученного пароля объекта из базы
                        const match = bcrypt.compareSync(req.body.pass, rw.Pass); //надо передать hash из БД
                        if (match) {
                            //Если true мы пускаем юзера
                            //и генерируем токен - поля которые хотим хранить в токене, секрет, длительность
                            //console.log(rw.ID , rw.Login); //значение параметров в том регистре, как они в базе
                            const token = jwt.sign({
                                id_user: rw.ID,
                                login: rw.Login}, secretKey, { expiresIn: '1h' }); //можно просто "1h" и т.п.
                            
                            res.status(200).json({name: rw.Name, token: `${token}`});
                            //"Ок, пароль верный"`);
                            console.log(`Пользователь с таким именем -
                                ${req.body.login} найден в бд, пароль верный, токен +!`);
                        } 
                        else {
                            //Выкидываем ошибку что пароль не верный
                            res.status(403).send(`введен не верный пароль`);
                            console.log(`Пользователь с таким именем -
                                ${req.body.login} есть, но пароль не верный!`);
                        }
                        return true
                    });
                };
            }
        );
    } 
    catch (e) {
        console.log(e);
        res.status(400).send('Autorization error');
    }
});

// ===================================================
// ДОБАВЛЕНИЕ НОВОГО ОТЗЫВА
// ===================================================
app.post(
    "/remarks", 
    bodyParser, 
    passport.authenticate("jwt", {session:false}),
    (req,res) => {
        console.log(req.body);
        if (!req.body || !req.body.theme || !req.body.text) {
            return res.sendStatus(400);
        }
        pool.query(`SELECT id, login FROM users WHERE login='${req.user}'`,(err,rows) => {
        
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            } 
            else {
                let id = rows[0].id;
                let login = rows[0].login;
                // rows.map(rw => {
                //     console.log(`PULLL ${rw.Login} ${rw.login}`);    
                // })
                // console.log(`IIIIIIIIIIIIIIII ${rows[0].id}`)
                // console.log(`IIIIIIIIIIIIIIII ${rows[1].login}`)
                // console.log(`IIIIIIIIIIIIIIII ${rows[1].Login}`)
                // console.log(`IIIIIIIIIIIIIIII ${rows[0].id}`)
                pool.query(`INSERT INTO remarks (ID_user, theme, text, login_user) VALUES
                    (${id},'${req.body.theme}','${req.body.text}','${login}')`,(err,rows) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            } 
                            else {
                                res.status(200).render("remarks.hbs");
                            }
                    }
                );
            }
        });
    }
);


// устанавливаем настройки для файлов layout
app.engine("hbs", expressHbs.engine( //expressHbs.engine() осуществляет конфигурацию движка
{
    layoutsDir: "views/layouts", //задает путь к папке с файлами layout относительно корня каталога проекта
    defaultLayout: "layout", //указывает на название файла шаблона
    extname: "hbs" //задает расширение файлов
}
))
// устанавливаем движок HBS для представления
app.set("view engine", "hbs");

// ===================================================
// УСТАНОВКА МАРШРУТОВ (эндпоинтов) для GET-запросов
// ===================================================
// возвращаем браузеру главную форму
app.get("/", function(req, res){
    res.render("index.hbs", {title: "ФК Восход"});
});
// возвращаем браузеру форму для регистрации
app.get("/create", function(req, res){
    res.render("create.hbs", {title: "Регистрация"});
});
// маршрут на ошибку регистрации
app.get("/createfault", function(req, res){
    res.render("createfault.hbs", {title: "Ошибка регистрации"});
});
// возвращаем браузеру форму для авторизации
app.get("/avtoriz", function(req, res){
    res.render("avtoriz.hbs", {title: "Авторизация"});
});
// возвращаем браузеру форму "Дополнительно"
app.get("/additional", function(req, res){
    res.render("additional.hbs", {title: "Дополнительно"});
});
// возвращаем браузеру форму "Обратная связь"
app.get("/feedback", function(req, res){
    res.render("feedback.hbs", {title: "Обратная связь"});
});
// возвращаем браузеру форму "Отзывы"
app.get(
    "/remarks", 
    (req, res) => {
        //маршрут на страницу с пользователями
        pool.query(
            `SELECT * FROM remarks`,
            (err, rows) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } 
                else {
                    // обновляем страницу с отзывами, отправляем title для header и все данные из remarks (тут в массиве)            
                    res.status(200).render(
                        "remarks.hbs", 
                        {title: "Отзывы", remarks: rows}
                    );
                    // rows.map(rw => {
                    //     console.log(`PULLL ${rw.username}`);    
                    // })
                    // console.log(`PULLL ${rows[0].id}`);
                    //можно отдавать данные в json
                    // let rows_str = JSON.stringify(rows);
                    // let data = `{"remarks": ${rows_str}}`;
                    // res.status(200).json(data);
                }
            }
        );
        //на период версии app без обращения к БД за отзывами - было простое обновление страницы с отзывами
        // res.render("remarks.hbs", {title: "Отзывы"});
    }
);


app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});
