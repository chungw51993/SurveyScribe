const chai = require('chai');
chai.use(require('chai-http'));

const { expect, request } = chai;
const app = require('../../index.js');

exports.MethodNotAllowed = (method, route) => (
  it('should return 405 METHOD NOT ALLOWED', (done) => {
    const expected = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'ALL'];
    expect(method).to.be.a('string');
    expect(expected).to.include(method.toUpperCase());
    request(app)[method](route)
      .then((response) => {
        expect(response).status(405);
        done();
      })
      .catch((error) => { done(error); });
  })
);
