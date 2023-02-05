//create a schema for typdefs and resolvers to replace this.

const router = require('express').Router();
const {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} = require('../../controllers/user-controller');

// import middleware
const { authMiddleware } = require('../../utils/auth');

// put authMiddleware anywhere we need to send a token for verification of user

router.route('/').post(createUser).put(authMiddleware, saveBook); // create mutations

router.route('/login').post(login); // create mutations

router.route('/me').get(authMiddleware, getSingleUser);// create mutations

router.route('/books/:bookId').delete(authMiddleware, deleteBook);// create mutations

module.exports = router;
