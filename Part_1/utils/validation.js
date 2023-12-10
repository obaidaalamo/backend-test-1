const validation = (req, res) => {
  const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const { title, description, date_time } = req.body;
  if (
    title === undefined ||
    title.length < 5 ||
    title.length > 50 ||
    format.test(title)
  ) {
    res.status(401).send({
      error:
        "Min 5 characters or Max 50 characters or No special characters or REQUIRED",
    });
    return true;
  }
  if (description.length > 50 || description === undefined) {
    res.status(401).send({
      error: "Max 500 characters and REQUIRED",
    });
    return true;
  }
  const time = Math.floor(Date.now() / 1000);
  if (
    parseInt(date_time) < time ||
    !new Date(parseInt(date_time)).getTime() > 0
  ) {
    res.status(401).send({
      error: "should be unix time or not before now or REQUIRED",
    });
    return true;
  }
  return time;
};

const validateImage = (req, res, image) => {
  if (
    image.mimetype !== "image/jpeg" ||
    image.size > 1000000 ||
    image === undefined
  ) {
    res.status(401).send({
      error: "ONLY jpg or exceeded image size of 1MB",
    });
    return true;
  }
};
module.exports = { validation, validateImage };
