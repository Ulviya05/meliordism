"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TweetModel = require("../../models/tweets/tweets.model");

var ReplyModel = require("../../models/replies/replies.model");

var TweetsController = {
  getTweets: function getTweets(req, res) {
    var user_id, func, reply_id, tweets, authToken, _user_id, _tweets;

    return regeneratorRuntime.async(function getTweets$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user_id = req.headers.authorization;
            console.log("ins", user_id);
            _context.prev = 2;
            func = null;
            reply_id = req.params.reply_id;

            if (reply_id && reply_id !== "ALL") {
              func = ReplyModel.Reply.findById(reply_id);
            } else {
              func = TweetModel.Tweet.find();
            }

            _context.next = 8;
            return regeneratorRuntime.awrap(func.populate({
              path: "user",
              model: "User",
              select: '-_id username image'
            }).populate({
              path: "replies",
              model: "Reply",
              populate: [{
                path: "user",
                model: "User"
              }, {
                path: "replies",
                model: "Reply",
                populate: [{
                  path: "user",
                  model: "User"
                }, {
                  path: "replies",
                  model: "Reply"
                }]
              }]
            }).lean().exec());

          case 8:
            tweets = _context.sent;

            if (req.headers.authorization) {
              authToken = req.headers.authorization;
              _user_id = "";

              if (authToken.startsWith("Bearer ")) {
                _user_id = authToken.substring(7, authToken.length);
              }

              tweets = tweets.map(function (tweet) {
                var user_idString = _user_id.toString();

                var liked = tweet.likes.some(function (like) {
                  return like.toString() === user_idString;
                });
                console.log(tweet.likes);
                console.log(liked, user_idString);
                return _objectSpread({}, tweet, {
                  liked: liked
                });
              });
            }

            if (reply_id && reply_id !== "ALL") {
              tweets = [tweets];
            }

            _tweets = tweets.map(function (tweet) {
              tweet.replies = tweet.replies.map(function (reply) {
                reply.replies = reply.replies.map(function (_reply) {
                  if (_reply.deleted) {
                    return {
                      _id: _reply._id,
                      deleted: true,
                      replies: _reply.replies
                    };
                  }

                  return _reply;
                });

                if (reply.deleted) {
                  return {
                    _id: reply._id,
                    deleted: true,
                    replies: reply.replies
                  };
                }

                return reply;
              });

              if (tweet.deleted) {
                return {
                  _id: tweet._id,
                  deleted: true,
                  replies: tweet.replies
                };
              }

              return tweet;
            });
            _tweets = _tweets.map(function (tweet) {
              if (tweet.likes) {
                tweet.likes = tweet.likes.length;
              }

              return tweet;
            });
            res.status(200).json({
              tweets: _tweets
            });
            _context.next = 20;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](2);
            console.log(_context.t0);
            res.status(500).json({
              message: "Something went wrong"
            });

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[2, 16]]);
  },
  createTweet: function createTweet(req, res) {
    var _req$body, user_id, content, tweet, populatedTweet;

    return regeneratorRuntime.async(function createTweet$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body = req.body, user_id = _req$body.user_id, content = _req$body.content;

            if (!(!user_id || !content)) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              message: "Invalid request"
            }));

          case 3:
            _context2.prev = 3;
            _context2.next = 6;
            return regeneratorRuntime.awrap(TweetModel.createTweet(user_id, content));

          case 6:
            tweet = _context2.sent;
            _context2.next = 9;
            return regeneratorRuntime.awrap(tweet.populate("user", "username image"));

          case 9:
            populatedTweet = _context2.sent;
            res.status(201).json({
              message: populatedTweet
            });
            _context2.next = 17;
            break;

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](3);
            console.log(_context2.t0);
            res.status(500).json({
              message: "Something went wrong"
            });

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[3, 13]]);
  },
  like: function like(req, res) {
    var _req$body2, tweet_id, user_id, tweet, remove;

    return regeneratorRuntime.async(function like$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$body2 = req.body, tweet_id = _req$body2.tweet_id, user_id = _req$body2.user_id;

            if (!(!tweet_id || !user_id)) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", res.status(400).json({
              message: "Invalid request"
            }));

          case 3:
            _context3.prev = 3;
            _context3.next = 6;
            return regeneratorRuntime.awrap(TweetModel.getTweetByIdAndPlusMinus(tweet_id));

          case 6:
            tweet = _context3.sent;
            console.log(tweet);

            if (!tweet) {
              _context3.next = 17;
              break;
            }

            if (!tweet.likes.includes(user_id)) {
              tweet.likes.push(user_id);
            } else {
              remove = tweet.likes.indexOf(user_id);
              tweet.likes.splice(remove, 1);
            }

            _context3.next = 12;
            return regeneratorRuntime.awrap(tweet.save());

          case 12:
            tweet = tweet.toObject();
            tweet.likes = tweet.likes.length;
            return _context3.abrupt("return", res.status(200).json({
              tweet: tweet
            }));

          case 17:
            console.log(tweet);
            return _context3.abrupt("return", res.status(400).json({
              message: "Invalid request"
            }));

          case 19:
            _context3.next = 25;
            break;

          case 21:
            _context3.prev = 21;
            _context3.t0 = _context3["catch"](3);
            console.log(_context3.t0);
            return _context3.abrupt("return", res.status(500).json({
              message: "Something went wrong"
            }));

          case 25:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[3, 21]]);
  },
  searchTweets: function searchTweets(req, res) {
    var query, tweets;
    return regeneratorRuntime.async(function searchTweets$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            query = req.query.query;
            console.log(query);
            _context4.next = 5;
            return regeneratorRuntime.awrap(TweetModel.searchTweets(query));

          case 5:
            tweets = _context4.sent;
            tweets = tweets.map(function (tweet) {
              tweet = tweet.toObject();
              tweet.likes = tweet.likes.length;
              return tweet;
            });
            return _context4.abrupt("return", res.status(200).json({
              tweets: tweets
            }));

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            console.error(_context4.t0);
            return _context4.abrupt("return", res.status(500).json({
              message: 'Something went wrong'
            }));

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 10]]);
  },
  deleteTweet: function deleteTweet(req, res) {
    var _req$params, tweet_id, type, deleteMe;

    return regeneratorRuntime.async(function deleteTweet$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _req$params = req.params, tweet_id = _req$params.tweet_id, type = _req$params.type;

            if (!(!tweet_id || !type)) {
              _context6.next = 3;
              break;
            }

            return _context6.abrupt("return", res.status(400).json({
              message: "Invalid request"
            }));

          case 3:
            _context6.prev = 3;

            deleteMe = function deleteMe(_delete) {
              return regeneratorRuntime.async(function deleteMe$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      _context5.next = 2;
                      return regeneratorRuntime.awrap(_delete(tweet_id));

                    case 2:
                      return _context5.abrupt("return", res.status(200).json({
                        message: "Tweet deleted"
                      }));

                    case 3:
                    case "end":
                      return _context5.stop();
                  }
                }
              });
            };

            if (!(type === "message")) {
              _context6.next = 9;
              break;
            }

            return _context6.abrupt("return", deleteMe(TweetModel.deleteTweet));

          case 9:
            if (!(type === "reply")) {
              _context6.next = 13;
              break;
            }

            return _context6.abrupt("return", deleteMe(ReplyModel.deleteReply));

          case 13:
            return _context6.abrupt("return", res.status(400).json({
              message: "Invalid request"
            }));

          case 14:
            _context6.next = 19;
            break;

          case 16:
            _context6.prev = 16;
            _context6.t0 = _context6["catch"](3);
            return _context6.abrupt("return", res.status(500).json({
              message: "Something went wrong"
            }));

          case 19:
          case "end":
            return _context6.stop();
        }
      }
    }, null, null, [[3, 16]]);
  },
  editTweet: function editTweet(req, res) {
    var _req$params2, tweet_id, type, edited_content, editMe;

    return regeneratorRuntime.async(function editTweet$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _req$params2 = req.params, tweet_id = _req$params2.tweet_id, type = _req$params2.type;
            edited_content = req.body.edited_content;

            if (!(!tweet_id || !edited_content || !type)) {
              _context8.next = 4;
              break;
            }

            return _context8.abrupt("return", res.status(400).json({
              message: "Invalid request"
            }));

          case 4:
            try {
              editMe = function editMe(_edit) {
                var tweet;
                return regeneratorRuntime.async(function editMe$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return regeneratorRuntime.awrap(_edit(tweet_id, edited_content));

                      case 2:
                        tweet = _context7.sent;
                        tweet = tweet.toObject();
                        tweet.likes = tweet.likes.length;
                        res.status(200).json({
                          tweet: tweet
                        });

                      case 6:
                      case "end":
                        return _context7.stop();
                    }
                  }
                });
              };

              if (type === "message") {
                editMe(TweetModel.editTweet);
              } else if (type === "reply") {
                editMe(ReplyModel.editReply);
              } else {
                res.status(400).json({
                  message: "Invalid request"
                });
              }
            } catch (error) {
              res.status(500).json({
                message: "Something went wrong"
              });
            }

          case 5:
          case "end":
            return _context8.stop();
        }
      }
    });
  }
};
module.exports = TweetsController;