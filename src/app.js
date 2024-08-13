const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const sassMiddleware = require("node-sass-middleware");
const sequelize = require("./config/database");
const browserSync = require("browser-sync");
const mainRouter = require("./routers");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const uploadDir = path.join(__dirname, "public", "uploads");

// Проверка существования директории
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Создание директории, если она не существует
}

// Переопределение метода с помощью заголовка X-HTTP-Method-Override в запросе
sequelize
  .sync({ force: false, logging: false }) // Используйте { force: true } только если нужно пересоздать таблицы
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((err) => console.log("Error: " + err));

app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: "auto" },
  })
);

app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"], // Указываем, какие методы мы хотим переопределять
  })
);

// Routes
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
