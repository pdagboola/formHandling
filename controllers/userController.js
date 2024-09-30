const { title } = require("process");
const usersStorage = require("../storage/usersStorage");
const { body, validationResult } = require("express-validator");
const { error } = require("console");

const alphError = "must only contain alphabets";
const lengthError = "must be between 1 and 10 characters";
const emailError = "must be in the standard email format";
const ageError = "must be a number";
const ageLengthError = "must be a number between 18 and 120";
const bioError = "cannot be more than 200 characters";

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphError}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthError}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphError}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthError}`),
  body("email").optional().trim().isEmail().withMessage(`Email ${emailError}`),
  body("age")
    .optional()
    .trim()
    .isNumeric()
    .withMessage(`Age ${ageError}`)
    .isInt({ min: 18, max: 120 })
    .withMessage(`Age  ${ageLengthError}`),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage(`Bio  ${bioError}`),
];

exports.userListGet = (req, res, next) => {
  res.render("index", { title: "Users List", users: usersStorage.getUsers() });
};
exports.userCreateGet = (req, res, next) => {
  res.render("createUser", { title: "Create User" });
};

exports.userCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("createUser", { title: "Create user", errors: errors.array() });
    }

    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.addUser({ firstName, lastName, email, age, bio });
    res.redirect("/");
  },
];

exports.userUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render("updateUser", { title: "Update User", user: user });
};

exports.userUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(404).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.updateUser(req.params.id, {
      firstName,
      lastName,
      email,
      age,
      bio,
    });
    res.redirect("/");
  },
];

exports.userDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};
exports.userSearchGet = (req, res) => {
  const { emailSearch } = req.query;
  const user = usersStorage.searchUser(emailSearch);

  if (!user) {
    const errorMsg = "No results found";

    res.render("search", {
      title: "Search results",
      user: user,
      error: errorMsg,
    });
  }
  res.render("search", { title: "Search results", user: user, error: "" });
  console.log(user);
};
console.log(usersStorage);
