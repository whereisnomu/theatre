const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
  // Регистрация нового пользователя
  static async register(req, res) {
    try {
      const { username, email, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await db.User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      req.session.message = "Пользователь успешно зарегистрирован";
      delete req.session.message;
      res.redirect("/auth/login");
    } catch (error) {
      req.session.error = "Ошибка при регистрации: " + error.message;

      console.error("Ошибка при регистрации:", error);

      res.redirect("/auth/register");
    }
  }

  // Вход пользователя
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await db.User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).send("Неверные учетные данные");
      }

      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

        // Установка cookie с JWT
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "development",
        });
        res.redirect("/");
      } else {
        res.status(401).send("Неверные учетные данные");
      }
    } catch (error) {
      console.error("Ошибка при входе:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Выход пользователя
  static async logout(req, res) {
    res.clearCookie("jwt");
    res.redirect("/auth/login");
  }

  static async authenticateToken(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
      } catch (err) {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(401);
    }
  }

  static optionalAuthentication(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
      return next();
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
    } catch (err) {
      console.error("Верификация токена провалена:", err);
    }
    next();
  }

  // Метод для требуемой аутентификации
  static requireAuthentication(req, res, next) {
    if (!req.user) {
      return res.redirect("/auth/login");
    }
    next();
  }
}

module.exports = AuthController;
