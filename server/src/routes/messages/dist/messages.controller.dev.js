"use strict";

var MessageModel = require("../../models/messages/messages.model");

var ReplyModel = require("../../models/replies/replies.model");

var VideoModel = require('../../models/video/video.model');

var MessagesController = {
  getMessages: function getMessages(req, res) {
    var user_id, findSign, func, reply_id, messages, _messages;

    return regeneratorRuntime.async(function getMessages$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user_id = req.headers.authorization;
            _context.prev = 1;

            findSign = function findSign(message) {
              var sign = "";

              if (message.plus.map(function (o) {
                return o.toString();
              }).includes(user_id)) {
                sign = "+";
              } else if (message.minus.map(function (o) {
                return o.toString();
              }).includes(user_id)) {
                sign = "-";
              }

              return sign;
            };

            func = null;
            reply_id = req.params.reply_id;

            if (reply_id && reply_id !== "ALL") {
              func = ReplyModel.Reply.findById(reply_id);
            } else {
              func = MessageModel.Message.find();
            }

            _context.next = 8;
            return regeneratorRuntime.awrap(func.populate({
              path: "user",
              model: "User"
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
            messages = _context.sent;

            if (reply_id && reply_id !== "ALL") {
              messages = [messages];
            }

            _messages = messages.map(function (message) {
              message.replies = message.replies.map(function (reply) {
                reply.replies = reply.replies.map(function (_reply) {
                  if (_reply.deleted) {
                    return {
                      _id: _reply._id,
                      deleted: true,
                      replies: _reply.replies
                    };
                  }

                  _reply.sign = findSign(_reply);
                  delete _reply["plus"];
                  delete _reply["minus"];
                  return _reply;
                });

                if (reply.deleted) {
                  return {
                    _id: reply._id,
                    deleted: true,
                    replies: reply.replies
                  };
                }

                reply.sign = findSign(reply);
                delete reply["plus"];
                delete reply["minus"];
                return reply;
              });

              if (message.deleted) {
                return {
                  _id: message._id,
                  deleted: true,
                  replies: message.replies
                };
              }

              message.sign = findSign(message);
              delete message["plus"];
              delete message["minus"];
              return message;
            });
            res.status(200).json({
              messages: _messages
            });
            _context.next = 18;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](1);
            console.log(_context.t0);
            res.status(500).json({
              message: "Something went wrong"
            });

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 14]]);
  },
  createMessage: function createMessage(req, res) {
    var _req$body, user_id, content, video_id, message, video, populatedMessage;

    return regeneratorRuntime.async(function createMessage$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body = req.body, user_id = _req$body.user_id, content = _req$body.content, video_id = _req$body.video_id;

            if (!(!user_id || !content || !video_id)) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              message: "Invalid request"
            }));

          case 3:
            _context2.prev = 3;
            _context2.next = 6;
            return regeneratorRuntime.awrap(MessageModel.createMessage(user_id, content));

          case 6:
            message = _context2.sent;
            _context2.next = 9;
            return regeneratorRuntime.awrap(VideoModel.getVideoById(video_id));

          case 9:
            video = _context2.sent;

            if (video) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt("return", res.status(404).json({
              message: "Video not found"
            }));

          case 12:
            video.messages.push(message._id);
            _context2.next = 15;
            return regeneratorRuntime.awrap(video.save());

          case 15:
            _context2.next = 17;
            return regeneratorRuntime.awrap(message.populate("user", "username image -_id"));

          case 17:
            populatedMessage = _context2.sent;
            res.status(201).json({
              message: populatedMessage
            });
            _context2.next = 25;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2["catch"](3);
            console.log(_context2.t0);
            res.status(500).json({
              message: "Something went wrong"
            });

          case 25:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[3, 21]]);
  },
  like: function like(req, res) {
    var _req$body2, message_id, user_id, message, remove;

    return regeneratorRuntime.async(function like$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$body2 = req.body, message_id = _req$body2.message_id, user_id = _req$body2.user_id;

            if (!(!message_id || !user_id)) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", res.status(400).json({
              message: "Invalid request"
            }));

          case 3:
            _context3.prev = 3;
            _context3.next = 6;
            return regeneratorRuntime.awrap(MessageModel.getMessageByIdAndPlusMinus(message_id));

          case 6:
            message = _context3.sent;
            console.log(message);

            if (!message) {
              _context3.next = 17;
              break;
            }

            if (!message.likes.includes(user_id)) {
              message.likes.push(user_id);
            } else {
              remove = message.likes.indexOf(user_id);
              message.likes.splice(remove, 1);
            }

            _context3.next = 12;
            return regeneratorRuntime.awrap(message.save());

          case 12:
            message = message.toObject();
            message.likes = message.likes.length;
            return _context3.abrupt("return", res.status(200).json({
              message: message
            }));

          case 17:
            console.log(message);
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
  deleteMessage: function deleteMessage(req, res) {
    var _req$params, message_id, type, video_id, deleteMe, video, index;

    return regeneratorRuntime.async(function deleteMessage$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$params = req.params, message_id = _req$params.message_id, type = _req$params.type, video_id = _req$params.video_id;

            if (!(!message_id || !type || !video_id)) {
              _context5.next = 3;
              break;
            }

            return _context5.abrupt("return", res.status(400).json({
              message: "Invalid request"
            }));

          case 3:
            _context5.prev = 3;

            deleteMe = function deleteMe(_delete) {
              return regeneratorRuntime.async(function deleteMe$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2;
                      return regeneratorRuntime.awrap(_delete(message_id));

                    case 2:
                      return _context4.abrupt("return", res.status(200).json({
                        message: "Message deleted"
                      }));

                    case 3:
                    case "end":
                      return _context4.stop();
                  }
                }
              });
            };

            if (!(type === "message")) {
              _context5.next = 19;
              break;
            }

            _context5.next = 8;
            return regeneratorRuntime.awrap(VideoModel.getVideoById(video_id));

          case 8:
            video = _context5.sent;

            if (video) {
              _context5.next = 11;
              break;
            }

            return _context5.abrupt("return", res.status(404).json({
              message: "Video not found"
            }));

          case 11:
            index = video.messages.indexOf(message_id);

            if (!(index > -1)) {
              _context5.next = 16;
              break;
            }

            video.messages.splice(index, 1);
            _context5.next = 16;
            return regeneratorRuntime.awrap(video.save());

          case 16:
            return _context5.abrupt("return", deleteMe(MessageModel.deleteMessage));

          case 19:
            if (!(type === "reply")) {
              _context5.next = 23;
              break;
            }

            return _context5.abrupt("return", deleteMe(ReplyModel.deleteReply));

          case 23:
            return _context5.abrupt("return", res.status(400).json({
              message: "Invalid request"
            }));

          case 24:
            _context5.next = 29;
            break;

          case 26:
            _context5.prev = 26;
            _context5.t0 = _context5["catch"](3);
            return _context5.abrupt("return", res.status(500).json({
              message: "Something went wrong"
            }));

          case 29:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[3, 26]]);
  },
  editMessage: function editMessage(req, res) {
    var _req$params2, message_id, type, edited_content, editMe;

    return regeneratorRuntime.async(function editMessage$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _req$params2 = req.params, message_id = _req$params2.message_id, type = _req$params2.type;
            edited_content = req.body.edited_content;

            if (!(!message_id || !edited_content || !type)) {
              _context7.next = 4;
              break;
            }

            return _context7.abrupt("return", res.status(400).json({
              message: "Invalid request"
            }));

          case 4:
            try {
              editMe = function editMe(_edit) {
                var message;
                return regeneratorRuntime.async(function editMe$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return regeneratorRuntime.awrap(_edit(message_id, edited_content));

                      case 2:
                        message = _context6.sent;
                        res.status(200).json({
                          message: message
                        });

                      case 4:
                      case "end":
                        return _context6.stop();
                    }
                  }
                });
              };

              if (type === "message") {
                editMe(MessageModel.editMessage);
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
            return _context7.stop();
        }
      }
    });
  }
};
module.exports = MessagesController;