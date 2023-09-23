"use strict";

var bcrypt = require('bcrypt');

var CodeModel = require('../../models/codes/codes.model');

var CodeController = {
  createCode: function createCode(req, res) {
    var _req$body, content, user_id, code;

    return regeneratorRuntime.async(function createCode$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, content = _req$body.content, user_id = _req$body.user_id;

            if (content) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", res.status(400).json({
              message: 'Invalid request'
            }));

          case 3:
            _context.prev = 3;
            _context.next = 6;
            return regeneratorRuntime.awrap(CodeModel.createCode(content));

          case 6:
            code = _context.sent;
            return _context.abrupt("return", res.status(201).json({
              message: code
            }));

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](3);
            console.log(_context.t0);
            return _context.abrupt("return", res.status(500).json({
              message: 'Something went wrong'
            }));

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[3, 10]]);
  } // getCode: async function(req, res) {
  //     const { id } = req.body;
  //     if (!id) {
  //         res.status(400).json({ message: "Invalid request" });
  //     }
  //     try {
  //         const user = await UserModel.getUserById(id);
  //         res.status(200).json({ user });
  //     } catch (error) {
  //         res.status(500).json({ message: "Something went wrong" });
  //     }
  // },
  // deleteCode: async function(req, res) {
  //     const { id } = req.body;
  //     if (!id) {
  //         res.status(400).json({ message: "Invalid request" });
  //     }
  //     try {
  //         const user = await CodeModel.deleteCode(id);
  //         res.status(200).json({ message: "Code deleted" });
  //     } catch (error) {
  //         res.status(500).json({ message: "Something went wrong" });
  //     }
  // }

};
module.exports = CodeController;