import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  // TODO:
  // STORE JWTs IN BLACKLIST - REDIS
  req.session = null;
  res.send({});
});

export { router as signoutRouter };