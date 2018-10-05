//STOPPED AT 34min

class ResponseError extends Error {
    constructor(res, body) {
        super(`${res.status} error requesting ${res.url}: ${res.statusText}`);
        this.status = res.status;
        this.path = res.url;
        this.body = body;
    }
}

class Github {
    constructor({token, baseUrl = 'https://api.github.com'} = {}) {
        this.token = token;
        this.baseUrl = baseUrl;
    }

    setToken(token) {
        this.token = token;
    }

    request(path, opts = {}) {
        const url = `${this.baseUrl}${path}`;
        const options = {
            ...opts,
            headers: {
                Accept: 'application/vnd.github.v3+json',
                Authorization: `token ${this.token}`,
            },
        };

        return fetch(url, options)
            .then(res => res.json()
                .then(data) => { 
                    if(!res.ok) {
                        throw new ResponseError(res, data);
                    }

                    return data;
                }
            );
    }

    user(username) {
        return this.request(`/users/${username}`);
    }
}

module.exports = Github;
