import * as rp from 'request-promise';

export class TestClient {
  url: string;
  options: {
    jar: any;
    withCredentials: boolean;
    json: boolean;
  };
  constructor(url: string) {
    this.url = url;
    this.options = {
      jar: rp.jar(),
      withCredentials: true,
      json: true
    };
  }

  // REGISTER
  async register(email: string, password: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `mutation {
          register(email: "${email}", password: "${password}") {
            path
            message
          }
        }`
      }
    });
  }

  // LOGIN
  async login(email: string, password: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `mutation {
          login(email: "${email}", password: "${password}") {
            path
            message
          }
        }`
      }
    });
  }

  // ME
  async me() {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `{
          me {
            id
            email
          }
        }`
      }
    });
  }

  // LOGOUT
  async logout() {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
        mutation {
          logout
        }
        `
      }
    });
  }
}
