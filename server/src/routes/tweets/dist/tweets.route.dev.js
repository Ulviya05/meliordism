"use strict";

var express = require("express");

var _require = require("../../utils/auth"),
    auth = _require.auth,
    my_message = _require.my_message,
    my_tweet = _require.my_tweet;

var TweetsController = require("./tweets.controller");

var tweetsRouter = express.Router(); // tweetsRouter.get(
//     "/:reply_id",
//     auth,
//     TweetsController.getTweets
// )

tweetsRouter.get("/", TweetsController.getTweets);
tweetsRouter.get("/search", TweetsController.searchTweets);
tweetsRouter.post("/", auth, TweetsController.createTweet);
tweetsRouter.post("/like", auth, TweetsController.like);
tweetsRouter.put("/:type/:tweet_id", auth, my_tweet, TweetsController.editTweet);
tweetsRouter.post("/reply", auth, TweetsController.createReply);
tweetsRouter["delete"]("/:type/:tweet_id", auth, my_tweet, TweetsController.deleteTweet);
module.exports = tweetsRouter;