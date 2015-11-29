// LICENSE : MIT
"use strict";
import Pocket from "../browser/pocket/pocket";
import {extractItemLinks} from "../util/extract-item-links";
export default function readAllLater(URL) {
    let pocket = new Pocket({
        // TODO
    });
    let urlList = extractItemLinks(URL);
    let tag = ["read-all-later"].join(",");
    let readPromises = urlList.map(url => {
        return pocket.add({
            url,
            tags
        });
    });
    return Promise.all(readPromises);
}