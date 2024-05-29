export const handleSaveErrors = (err, data, next) => {
  if (err.code === 11000) {
    err.status = 409;
  } else {
    err.status = 400;
  }
  next();
}

export const handleUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
}