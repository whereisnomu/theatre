const multer = require("multer");
const path = require("path");

// Настройка хранения для Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Saving file to:", path.join(__dirname, "../public/uploads"));
    cb(null, path.join(__dirname, "../public/uploads"));
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Именование файла
  },
});

const upload = multer({ storage: storage });

const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");

// Главная страница административной панели
router.get("/", (req, res) => {
  res.render("admin/dashboard", { title: "Admin Dashboard" });
});

// Маршруты для управления пользователями
router.get("/users", AdminController.getAllUsers);
router.delete("/users/:id", AdminController.deleteUser);
router.post("/users/add", AdminController.addUser);

// Маршруты для управления спектаклями
router.get("/shows", AdminController.getAllShows); 
router.post("/shows", upload.single("imagePath"), AdminController.addShow);
router.get("/shows/edit/:id", AdminController.getEditShow);
router.put(
  "/shows/:id",
  upload.single("imagePath"),
  AdminController.updateShow
);
router.delete("/shows/:id", AdminController.deleteShow);

// Маршруты для управления жанрами
router.get("/genres", AdminController.getAllGenres); 
router.post("/genres/add", AdminController.addGenre);
router.delete("/genres/:id", AdminController.deleteGenre);

// Маршруты для управления заказами
router.get("/orders", AdminController.getAllOrders); 
router.post("/orders", AdminController.addOrder);
router.put("/orders/:id", AdminController.updateOrder);
router.post("/orders/update-status", AdminController.updateOrderStatus);
router.post("/orders/delete/:orderId", AdminController.deleteOrder);

module.exports = router;
