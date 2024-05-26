import HttpError from "../helpers/HttpError.js";

const isEmptyBody = (req, _, next) => {
  if (Object.keys(req.body).length === 0) {
    next(HttpError(400, "Body must have at least one field"));
  } else {
    next();
  }
};

export default isEmptyBody;
