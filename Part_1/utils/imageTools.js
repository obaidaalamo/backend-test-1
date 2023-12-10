const sharp = require("sharp");
const fs = require("fs");

const saveImage = (file, name) => {
  fs.writeFile("./temp/" + name, file.data, "binary", function (err) {
    if (err) throw err;
    console.log("File saved.");
  });
};

const compressImageAndClearTemp = async (file, name) => {
  await sharp(file.data)
    .jpeg({ quality: 25 })
    .toFile("./images/" + name);
  fs.unlinkSync("./temp/" + name);
};
module.exports = { saveImage, compressImageAndClearTemp };
