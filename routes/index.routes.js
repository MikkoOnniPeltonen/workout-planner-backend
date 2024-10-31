const router = require("express").Router();

router.get("/index", (req, res) => {
  res.json("All good in here");
});

module.exports = router;
