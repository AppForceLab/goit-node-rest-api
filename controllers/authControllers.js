import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWraper from "../decorators/ctrlWrapper.js";

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await authServices.signup(email, password);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.signin(email, password);
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  res.json({
    token: user.token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
}

const logout = async (req, res) => {
  const  user  = await authServices.findUserById(req.user._id.toString());
  if (user.token != req.user.token) {
    throw HttpError(401, "Unauthorized");
  }
  await authServices.logout(user);
  res.status(204).json({});
}

const getCurrentUser = async (req, res) => {
  const user = await authServices.findUserById(req.user._id.toString());
  if (user.token != req.user.token) {
    throw HttpError(401, "Unauthorized");
  }
  res.json({
      email: user.email,
      subscription: user.subscription
    },
  );
}

export default {
  signup: ctrlWraper(signup),
  signin: ctrlWraper(signin),
  logout: ctrlWraper(logout),
  getCurrentUser: ctrlWraper(getCurrentUser),
};
