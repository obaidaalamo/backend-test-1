const request = require("supertest");
const app = require("./app");
const fs = require("fs");

describe("POST /set-blogs", () => {
  test("Add partial blog post fields", async () => {
    const response = await request(app)
      .post("/set-blogs")
      .field("description", "this is description test")
      .field("date_time", Math.floor(Date.now()) + 60)
      .field("complex_object", '{"attribute": "value"}', {
        contentType: "application/json",
      })
      .attach("main_image", "./testImages/test1.jpg");

    expect(response.body.error).toEqual(
      "Min 5 characters or Max 50 characters or No special characters or REQUIRED"
    );
    expect(response.statusCode).toBe(401);
  });
});

describe("POST /set-blogs", () => {
  test("Add full blog post fields with main_image that exceeds 1MB", async () => {
    const response = await request(app)
      .post("/set-blogs")
      .field("title", "this is title test")
      .field("description", "this is description test")
      .field("date_time", Math.floor(Date.now()) + 60)
      .field("complex_object", '{"attribute": "value"}', {
        contentType: "application/json",
      })
      .attach("main_image", "./testImages/test.jpg");

    expect(response.body.error).toEqual(
      "ONLY jpg or exceeded image size of 1MB"
    );
    expect(response.statusCode).toBe(401);
  });
});

describe("POST /set-blogs", () => {
  test("Add full blog post fields with title that has special characters", async () => {
    const response = await request(app)
      .post("/set-blogs")
      .field("title", "this_is title test")
      .field("description", "this is description test")
      .field("date_time", Math.floor(Date.now()) + 60)
      .field("complex_object", '{"attribute": "value"}', {
        contentType: "application/json",
      })
      .attach("main_image", "./testImages/test1.jpg");

    expect(response.body.error).toEqual(
      "Min 5 characters or Max 50 characters or No special characters or REQUIRED"
    );
    expect(response.statusCode).toBe(401);
  });
});

describe("POST /set-blogs", () => {
  test("Add full blog post fields with ISO date_time", async () => {
    const response = await request(app)
      .post("/set-blogs")
      .field("title", "this is title test")
      .field("description", "this is description test")
      .field("date_time", "not date")
      .field("complex_object", '{"attribute": "value"}', {
        contentType: "application/json",
      })
      .attach("main_image", "./testImages/test1.jpg");

    expect(response.body.error).toEqual(
      "should be unix time or not before now or REQUIRED"
    );
    expect(response.statusCode).toBe(401);
  });
});

describe("GET /get-blogs", () => {
  test("Add blog post then Get all blog posts successful Test", async () => {
    const response = await request(app).get("/get-blogs");
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /get-blogs POST /set-blogs", () => {
  test("Add blog post then Get all blog posts failed Test", async () => {
    const response = await request(app).get("/get-blogs");
    const dataLength = response.body.result.length;
    await request(app)
      .post("/set-blogs")
      .field("title", "this is title test")
      .field("description", "this is description test")
      .field("date_time", "not date")
      .field("complex_object", '{"attribute": "value"}', {
        contentType: "application/json",
      })
      .attach("main_image", "./testImages/test1.jpg");
    const response2 = await request(app).get("/get-blogs");
    const dataLength2 = response2.body.result.length;
    expect(dataLength).toEqual(dataLength2);
  });
});

describe("GET /get-blogs POST /set-blogs", () => {
  test("Get token from Generate token API and send to Get image by token API successful Test", async () => {
    const response = await request(app)
      .post("/set-blogs")
      .field("title", "this is title test")
      .field("description", "this is description test")
      .field("date_time", Math.floor(Date.now()) + 60)
      .field("complex_object", '{"attribute": "value"}', {
        contentType: "application/json",
      })
      .attach("main_image", "./testImages/test1.jpg")
      .attach("additional_images", "./testImages/test1.jpg")
      .attach("additional_images", "./testImages/test1.jpg");
    const image = response.body.result.main_image;
    const response2 = await request(app)
      .post("/generate-token")
      .field("image_path", image);
    const response3 = await request(app)
      .get("/" + image)
      .set("x-access-token", response2.body.token);
    expect(response3.statusCode).toBe(200);
  });
});

describe("POST /generate-token POST /set-blogs", () => {
  test("Get token from Generate token API and send to Get image by token API failed Test", async () => {
    const response = await request(app)
      .post("/set-blogs")
      .field("title", "this is title test")
      .field("description", "this is description test")
      .field("date_time", Math.floor(Date.now()) + 60)
      .field("complex_object", '{"attribute": "value"}', {
        contentType: "application/json",
      })
      .attach("main_image", "./testImages/test1.jpg")
      .attach("additional_images", "./testImages/test1.jpg")
      .attach("additional_images", "./testImages/test1.jpg");
    const image = response.body.result.main_image;
    const response2 = await request(app)
      .post("/generate-token")
      .field("image_path", image);
    const response3 = await request(app)
      .get("/images/" + "notimage.jpg")
      .set("x-access-token", response2.body.token);
    expect(response3.body.error).toEqual("bad token");
    expect(response3.statusCode).toBe(401);
  });
});
