import assert from "power-assert"
import jsdom from "jsdom";
import fs from "fs";
import {extractItemLinks} from "../src/util/extract-item-links";
describe("extract-item-links-test", function () {
    context("node", function () {
        it("should return URL list", function () {
            let ml = ["javascript", "frontrend", "node"];
            let promises = ml.map(type => {
                return new Promise((resolve, reject) => {
                    const content = fs.readFileSync(__dirname + "/fixtures/" + type + "/index.html", "utf-8");
                    jsdom.env(
                        content,
                        function (err, window) {
                            if (err) {
                                return reject(err);
                            }
                            let links = extractItemLinks(window, window.document);
                            console.log(type + " " + links.length);
                            assert(links.length > 10);
                            resolve();
                        }
                    );

                });
            });
            return Promise.all(promises);
        });
    })
});