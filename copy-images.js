import fs from "fs-extra";
import path from "path";
import { exit } from "process";

const art = path.resolve("./src/content/images/Art");
const work = path.resolve("./src/content/images/Work");
const blog = path.resolve("./src/content/images/Blog");
const photos = path.resolve("./src/content/photos");
const dest = path.resolve("./public/images");

fs.copy(art, dest + "/Art")
  .then(() => {
    fs.copy(work, dest + "/Work")
      .then(() => {
        fs.copy(blog, dest + "/Blog")
          .then(() => {
            console.log("Images copied");
          })
          .catch((err) => {
            console.error(err);
            exit(1);
          });
      })
      .catch((err) => {
        console.error(err);
        exit(1);
      });
  })
  .catch((err) => {
    console.error(err);
    exit(1);
  });
