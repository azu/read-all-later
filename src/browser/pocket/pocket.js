import assert from "assert";
const POCKET_URL = {
    request: 'https://getpocket.com/v3/oauth/request',
    authorise: (requestToken, redirectUri) => `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectUri}`,
    accessToken: 'https://getpocket.com/v3/oauth/authorize',
    get: 'https://getpocket.com/v3/get',
    add: 'https://getpocket.com/v3/add'
};

function pocketFetch(url, body) {
    return fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json; charset=UTF8',
            'X-Accept': 'application/json'
        },
        body: JSON.stringify(body)
    }).then((response) => new Promise((resolve, reject) => {
        if (response.status === 200) {
            resolve(response);
            return;
        }
        reject({
            status: response.status,
            message: response.statusText,
            error: response.headers.get('X-Error'),
            errorCode: response.headers.get('X-Error-Code')
        });
    })).then(res => res.json());
}

export default class Pocket {
    constructor({consumerKey, accessToken}) {
        this.consumerKey = consumerKey;
        this.accessToken = accessToken;
    }

    add(body) {
        assert(body.url, "need url");
        var access = {consumer_key: this.consumerKey, access_token: this.accessToken};
        return pocketFetch(POCKET_URL.add, Object.assign({},
            access,
            body
        ));
    }

    get(body) {
        var access = {consumer_key: this.consumerKey, access_token: this.accessToken};
        return pocketFetch(POCKET_URL.get, Object.assign({},
            access,
            body
        ));
    }
};
