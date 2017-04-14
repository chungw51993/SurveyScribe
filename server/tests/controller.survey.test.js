const chai = require('chai');
chai.use(require('chai-http'));
chai.use(require('chai-shallow-deep-equal'));

const { expect, request } = chai;
const app = require('../index.js');
const Survey = require('mongoose').model('Survey');
const User = require('mongoose').model('User');
const { MethodNotAllowed } = require('./helpers/methodNotAllowed.js');

describe('Survey routes', () => {
  before((done) => {
    User.create({ name: 'testinguser', password: 'testinguser123' }, done);
  });

  after((done) => {
    User.remove({}, done);
  });

  beforeEach((done) => {
    Survey.remove({}, done);
  });
  afterEach((done) => {
    Survey.remove({}, done);
  });

  describe('/api/survey', () => {
    describe('GET', () => {
      it('should return 200 and all of user\'s surveys', (done) => {
        const expected = Survey.sample();
        const agent = chai.request.agent(app);

        Survey.create(expected)
          .then(() =>
            agent.post('/api/login')
              .send({ name: 'testinguser', password: 'testinguser123' })
              .then(() => {
                agent.get('/api/surveys')
                  .then((response) => {
                    expect(response).status(200);
                    expect(response).to.be.json;
                    expect(response.body.length);
                    expect(response.body[0]).to.shallowDeepEqual(expected);
                    done();
                  })
                  .catch(done);
              })
          );
      });

      it('should return 401 if user\'s not authenticated', (done) => {
        const expected = Survey.sample();
        Survey.create(expected)
          .then(() =>
            request(app)
              .get('/api/surveys')
          )
          .then(done)
          .catch((error) => {
            expect(error).status(401);
            done();
          });
      });
    });

    describe('POST', () => {
      it('should return 201 when survey is created', (done) => {
        const expected = Survey.sample();
        const agent = chai.request.agent(app);

        agent.post('/api/login')
          .send({ name: 'testinguser', password: 'testinguser123' })
          .then(() => {
            agent.post('/api/surveys')
              .send(expected)
              .then((response) => {
                expect(response).status(201);
                expect(response).to.be.json;
                expect(response.body.length);
                expect(response.body[0]).to.shallowDeepEqual(expected);
                done();
              })
              .catch(done);
          });
      });

      it('should return 400 if invalid input', (done) => {
        const agent = chai.request.agent(app);

        agent.post('/api/login')
          .send({ name: 'testinguser', password: 'testinguser123' })
          .then(() => {
            agent.post('/api/surveys')
              .send({ invalid: 'input' })
              .then((response) => {
                expect(response).status(400);
                done();
              })
              .catch(done);
          });
      });

      it('should return 401 if user\'s not authenticated', (done) => {
        const expected = Survey.sample();

        request(app)
          .post('/api/surveys')
          .send(expected)
          .then(done)
          .catch((error) => {
            expect(error).status(401);
            done();
          });
      });

      it('should return 401 if user\'s not the owner', (done) => {
        done();
      });
    });

    // describe('PUT', MethodNotAllowed('put', '/api/surveys'));

    // describe('DELETE', MethodNotAllowed('delete', '/api/surveys'));
  });

  describe('/api/survey/:survey', () => {
    describe('GET', () => {
      it('should return 200 and specified survey', (done) => {
        const expected = Survey.sample();
        const agent = chai.request.agent(app);

        Survey.create(expected)
          .then(() => {
            agent.post('/api/login')
              .send({ name: 'testinguser', password: 'testinguser123' })
              .then(() => {
                agent.get('/api/survey/58ee63c65a2d576d5125b4bc')
                  .then((response) => {
                    expect(response).status(200);
                    expect(response).to.be.json;
                    expect(response.body.length);
                    expect(response.body).to.shallowDeepEqual(expected);
                    done();
                  })
                  .catch(done);
              });
          });
      });

      it('should return 404 if survey doesn\'t exist', (done) => {
        const agent = chai.request.agent(app);

        agent.post('/api/login')
          .send({ name: 'testinguser', password: 'testinguser123' })
          .then(() => {
            agent.get('app/survey/invalidsurvey')
              .then((response) => {
                expect(response).status(404);
              })
              .catch(done);
          });
      });

      it('should return 401 if user\'s not authenticated', (done) => {
        const expected = Survey.sample();

        Survey.create(expected)
          .then(() => {
            request(app)
              .get('/api/survey/58ee63c65a2d576d5125b4bc');
          })
          .then(done)
          .catch((error) => {
            expect(error).status(401);
            done();
          });
      });
    });

    describe('PUT', () => {
      it('should return 200 and update part of the survey', (done) => {
        const expected = Survey.sample();
        const agent = chai.request.agent(app);

        Survey.create(expected)
          .then(() => {
            agent.post('/api/login')
              .send({ name: 'testinguser', password: 'testinguser123' })
              .then(() => {
                agent.put('/api/survey/58ee63c65a2d576d5125b4bc')
                  .send({ title: 'another title' })
                  .then((response) => {
                    expect(response).status(200);
                    expect(response).to.be.json;
                    expect(response.body.length);
                    expect(response.body[0].title).to.equal('another title');
                    done();
                  })
                  .catch(done);
              });
          });
      });

      it('should return 400 if invalid input', (done) => {
        const expected = Survey.sample();
        const agent = chai.request.agent(app);

        Survey.create(expected)
          .then(() => {
            agent.post('/api/login')
              .send({ name: 'testinguser', password: 'testinguser123' })
              .then(() => {
                agent.put('/api/survey/58ee63c65a2d576d5125b4bc')
                  .send({ invalid: 'input' })
                  .then((response) => {
                    expect(response).status(400);
                    done();
                  })
                  .catch(done);
              });
          });
      });

      it('should return 401 if user\'s not authenticated', (done) => {
        const expected = Survey.sample();

        Survey.create(expected)
          .then(() => {
            request.put('/api/survey/58ee63c65a2d576d5125b4bc')
              .send({ title: 'not authenticated' });
          })
          .then(done)
          .catch((error) => {
            expect(error).status(401);
            done();
          });
      });

      it('should return 401 if user\'s not the owner', () => {

      });
    });

    describe('DELETE', () => {
      it('should return 200 and delete the survey', (done) => {
        const expected = Survey.sample();
        const agent = chai.request.agent(app);

        Survey.create(expected)
          .then(() => {
            agent.post('/api/login')
              .send({ name: 'testinguser', password: 'testinguser123' })
              .then(() => {
                agent.delete('/api/survey/58ee63c65a2d576d5125b4bc')
                  .then((response) => {
                    expect(response).status(200);
                    expect(response.body.length).to.equal(0);
                    done();
                  })
                  .catch(done);
              });
          });
      });

      it('should return 401 if user\'s not authenticated', (done) => {
        const expected = Survey.sample();

        Survey.create(expected)
          .then(() => {
            request.delete('/api/survey/58ee63c65a2d576d5125b4bc');
          })
          .then(done)
          .catch((error) => {
            expect(error).status(401);
            done();
          });
      });

      it('should return 401 if user\'s not the owner', () => {

      });
    });

    // describe('POST', MethodNotAllowed('post', '/api/surveys/58ee63c65a2d576d5125b4c5'));
  });

  xdescribe('/api/survey/:survey/responses', () => {
    describe('GET', () => {
      it('should return 200 and all of survey\'s responses', (done) => {
        const expected = Survey.sample();
        const agent = chai.request.agent(app);

        Survey.create(expected)
          .then(() =>
            agent.post('/api/login')
              .send({ name: 'testinguser', password: 'testinguser123' })
              .then(() => {
                agent.get('/api/surveys/58ee63c65a2d576d5125b4bc/responses')
                  .then((response) => {
                    expect(response).status(200);
                    expect(response).to.be.json;
                    expect(response.body.length);
                    done();
                  })
                  .catch(done);
              })
          );
      });

      it('should return 404 if survey doesn\'t exist', (done) => {
        const expected = Survey.sample();
        const agent = chai.request.agent(app);

        Survey.create(expected)
          .then(() =>
            agent.post('/api/login')
              .send({ name: 'testinguser', password: 'testinguser123' })
              .then(() => {
                agent.get('/api/surveys/doesnotexist/responses')
                  .then((response) => {
                    expect(response).status(404);
                    done();
                  })
                  .catch(done);
              })
          );
      });

      it('should return 401 if user\'s not authenticated', (done) => {
        const expected = Survey.sample();

        Survey.create(expected)
          .then(() => {
            request.get('/api/surveys/58ee63c65a2d576d5125b4bc/responses');
          })
          .then(done)
          .catch((error) => {
            expect(error).status(401);
            done();
          });
      });

      it('should return 401 if user\'s not the owner', () => {

      });
    });

    // describe('PUT', MethodNotAllowed('put', '/api/surveys/58ee63c65a2d576d5125b4c5/responses'));

    // describe('DELETE', MethodNotAllowed('delete', '/api/surveys/58ee63c65a2d576d5125b4c5/responses'));
  });

  xdescribe('/api/survey/:survey/responses/:response', () => {
    describe('GET', () => {
      it('should return 200 and specified response', (done) => {
        const expected = Survey.sample();
        const agent = chai.request.agent(app);

        Survey.create(expected)
          .then(() =>
            agent.post('/api/login')
              .send({ name: 'testinguser', password: 'testinguser123' })
              .then(() => {
                agent.get('/api/surveys/58ee63c65a2d576d5125b4c5/responses/58ee6904fdebd16dfdd99f91')
                  .then((response) => {
                    expect(response).status(200);
                    expect(response).to.be.json;
                    expect(response.body.length);
                    done();
                  })
                  .catch((error) => { done(error); });
              })
          );
      });

      it('should return 404 if survey doesn\'t exist', (done) => {
        const expected = Survey.sample();
        const agent = chai.request.agent(app);

        Survey.create(expected)
          .then(() =>
            agent.post('/api/login')
              .send({ name: 'testinguser', password: 'testinguser123' })
              .then(() => {
                agent.get('/api/surveys/58ee63c65a2d576d5125b4c5/responses/doesnotexist')
                  .then((response) => {
                    expect(response).status(404);
                    done();
                  })
                  .catch((error) => { done(error); });
              })
          );
      });

      it('should return 401 if user\'s not authenticated', (done) => {
        const expected = Survey.sample();

        Survey.create(expected)
          .then(() => {
            request.get('/api/surveys/58ee63c65a2d576d5125b4c5/responses/58ee6904fdebd16dfdd99f91');
          })
          .then((response) => { done(response); })
          .catch((error) => {
            expect(error).status(401);
            done();
          });
      });

      it('should return 401 if user\'s not the owner', () => {

      });
    });

    // describe('PUT', MethodNotAllowed('put', '/api/surveys/58ee63c65a2d576d5125b4c5/responses/58ee6904fdebd16dfdd99f91'));

    // describe('DELETE', MethodNotAllowed('delete', '/api/surveys/58ee63c65a2d576d5125b4c5/responses/58ee6904fdebd16dfdd99f91'));
  });
});
