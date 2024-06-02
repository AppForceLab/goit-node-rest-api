import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWraper from "../decorators/ctrlWrapper.js";
import emailToFilename from "../helpers/emailToFilename.js";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/mailer.js";

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const verificationToken = nanoid();

  const verifyEmail = {
    to: email,
    subject: "Verify your email",
    html: `
    <h1>Verify your email</h1>
    <p>Click <a target="_blank" href="http://localhost:3000/users/verify/${verificationToken}">here</a> to verify your email</p>
    `,
  };

  sendEmail(verifyEmail);

  const avatarURL = gravatar.url(email, {
    s: 100,
    r: "x",
    d: "retro",
  });
  const newUser = await authServices.signup(
    email,
    password,
    avatarURL,
    verificationToken
  );
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: avatarURL,
    },
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.signin(email, password);
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (user.verify != true) {
    throw HttpError(401, "Email not verified");
  }
  res.json({
    token: user.token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const user = await authServices.findUserById(req.user._id.toString());
  if (user.token != req.user.token) {
    throw HttpError(401, "Unauthorized");
  }
  await authServices.logout(user);
  res.status(204).json({});
};

const getCurrentUser = async (req, res) => {
  const user = await authServices.findUserById(req.user._id.toString());
  if (user.token != req.user.token) {
    throw HttpError(401, "Unauthorized");
  }
  res.json({
    email: user.email,
    subscription: user.subscription,
  });
};

const updateAvatar = async (req, res, next) => {
  const { _id: owner } = req.user;
  const user = await authServices.findUserById(owner);
  if (user.token != req.user.token) {
    throw HttpError(401, "Not authorized");
  }

  if (!req.file) {
    next(HttpError(400, "No file received"));
  } else {
    const avatarsPath = path.resolve("public", "avatars");
    const { path: oldPath, filename } = req.file;
    const extension = path.extname(filename);
    const newFileName = emailToFilename(user.email) + extension;
    const newPath = path.join(avatarsPath, newFileName);

    Jimp.read(oldPath)
      .then((image) => {
        image.resize(250, 250);
        image.write(newPath);
      })
      .catch((err) => {
        throw HttpError(500);
      });

    await fs.unlink(oldPath);

    const avatar = path.join("avatars", newFileName);
    user.avatarURL = avatar;
    await user.save();

    res.json({
      avatarURL: user.avatarURL,
    });
  }
};

const verifyUser = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await authServices.findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, 'User not found') ;
  }
  if (user.verify == true) {
    throw HttpError(400, "Verification has already been passed");
  }
  user.verify = true;
  await user.save();
  res.json({
    message: "Verification successful",
  });
};

const verifyUserRequest = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(400, "missing required field email");
  }
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404);
  }
  if (user.verify == true) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify your email",
    html: `
  <h1>Verify your email</h1>
  <p>Click <a target="_blank" href="http://localhost:3000/users/verify/${user.verificationToken}">here</a> to verify your email</p>
  `,
  };

  sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

export default {
  signup: ctrlWraper(signup),
  signin: ctrlWraper(signin),
  logout: ctrlWraper(logout),
  getCurrentUser: ctrlWraper(getCurrentUser),
  updateAvatar: ctrlWraper(updateAvatar),
  verifyUser: ctrlWraper(verifyUser),
  verifyUserRequest: ctrlWraper(verifyUserRequest),
};
