const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const { getDate } = require("./utils/timeFormat");
const jwt = require("jsonwebtoken");
const { validation, validateImage } = require("./utils/validation");
const { saveImage, compressImageAndClearTemp } = require("./utils/imageTools");

const app = express();
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors(corsOptions));

app.post("/set-blogs", async (req, res) => {
  const { title, description, date_time } = req.body;
  const time = validation(req, res);
  if (time === true) return;
  const { main_image, additional_images } = req.files || req.body;
  let valedatestate = validateImage(req, res, main_image);
  if (valedatestate) return;
  saveImage(main_image, "main_image_" + time + ".jpg");
  await compressImageAndClearTemp(main_image, "main_image_" + time + ".jpg");
  const additional_images_list = [];
  if (additional_images) {
    if (additional_images.length > 5) {
      res.status(401).send({
        error: "MAX number of images 5",
      });
      return;
    }

    for (let x = 0; x < additional_images.length; x++) {
      const element = additional_images[x];

      valedatestate = validateImage(req, res, element);
      if (valedatestate) return;
      saveImage(element, "additional_image_" + (x + 1) + "_" + time + ".jpg");

      await compressImageAndClearTemp(
        element,
        "additional_image_" + (x + 1) + "_" + time + ".jpg"
      );

      additional_images_list.push(
        "images/additional_image_" + (x + 1) + "_" + time + ".jpg"
      );
    }
  }
  fs.readFile("./blogs.json", "utf8", function (err, data) {
    if (err) throw err;
    const obj = JSON.parse(data);
    const result = {
      reference: obj.length === 0 ? 1 : obj[obj.length - 1].reference + 1,
      title: title,
      description: description,
      main_image: "images/main_image_" + time + ".jpg",
      additional_images: additional_images_list,
      date_time: date_time,
    };
    obj.push(result);
    fs.writeFile("./blogs.json", JSON.stringify(obj), (err) => {
      if (err) {
        console.log(err.message);

        throw err;
      }

      console.log("data is updated");
      res.status(200).send({ result: result });
    });
  });
});

app.get("/images/:image", function (req, res) {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, "secret");
    if ("images/" + req.params.image === decoded.data)
      fs.readFile("./" + decoded.data, function (err, content) {
        res.end(content);
      });
    else {
      return res.status(401).send({ error: "bad token" });
    }
  } catch (err) {
    return res.status(401).send({ error: "bad token" });
  }
});

app.get("/get-blogs", async (req, res) => {
  fs.readFile("./blogs.json", "utf8", function (err, data) {
    if (err) throw err;
    const obj = JSON.parse(data);
    const result = [];
    for (let x = 0; x < obj.length; x++) {
      const element = obj[x];

      result.push({
        reference: element.reference,
        title: element.title.toLocaleLowerCase().replace(" ", "_"),
        description: element.description,
        main_image: element.main_image,
        additional_images: element.additional_images,
        date_time: getDate(element.date_time),
      });
    }
    res.status(200).send({ result: result });
  });
});

app.post("/generate-token", function (req, res) {
  const { image_path } = req.body;
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 5,
      data: image_path,
    },
    "secret"
  );
  res.status(200).send({ token });
});

module.exports = app;
