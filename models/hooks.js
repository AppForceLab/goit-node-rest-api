export const handleSaveErrors = (err, data, next) => {
  err.status = 400;
  next();
}

export const handleUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
}