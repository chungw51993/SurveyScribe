import chai from 'chai';
import deepFreeze from 'deep-freeze';
import reducer from './index';

import { surveys } from '../data/surveys';
import { questions } from '../data/questions';
import { options } from '../data/options';
import { response } from '../data/response';
import { mongoSurveys } from '../data/mongoSurveys';
import { mongoSurvey } from '../data/mongoSurvey';
import { mongoResponses } from '../data/mongoResponses';
import { normalizeSurveys, normalizeSurvey, normalizeResponses } from '../utilities/normalize';

const { expect } = chai;

describe('REDUCERS', () => {
  // unit tests for update actions
  describe('Update', () => {
    const initialState = {
      surveys
    };
    describe('UPDATE_SURVEYS', () => {
      it('should rewrite all stored survey data', () => {
        const converted = normalizeSurveys(mongoSurveys);

        const action = {
          type: 'UPDATE_SURVEYS',
          surveys: converted
        };

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);
        expect(changedState).to.not.deep.equal(initialState.surveys);
        expect(changedState.surveys).to.deep.equal(converted);
      });
    });
    describe('UPDATE_SURVEY', () => {
      it('should rewrite all stored question and option data', () => {
        const converted = normalizeSurvey(mongoSurvey);

        const action = {
          type: 'UPDATE_SURVEY',
          questions: converted.questions,
          options: converted.options
        };

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(changedState).to.not.deep.equal(
          { questions: initialState.questions, options: initialState.options });
        expect(changedState.questions).to.deep.equal(converted.questions);
        expect(changedState.options).to.deep.equal(converted.options);
      });
    });
    describe('UPDATE_RESPONSES', () => {
      it('should rewrite all stored responses data', () => {
        const converted = normalizeResponses(mongoResponses);

        const action = {
          type: 'UPDATE_RESPONSES',
          responses: converted
        };

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(changedState).to.not.deep.equal(initialState.responses);
        expect(changedState.responses).to.equal(converted);
      });
    });
    describe('UPDATE_AGGREGATES', () => {
      it('should rewrite all stored aggregates data', () => {
        const converted = normalizeResponses(mongoResponses);

        const action = {
          type: 'UPDATE_AGGREGATES',
          aggregates: converted
        };

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(changedState).to.not.deep.equal(initialState.aggregates);
        expect(changedState.aggregates).to.equal(converted);
      });
    });
  });
   // unit tests for surveys reducer
  describe('Surveys', () => {
    const initialState = {
      surveys,
      questions: {},
      options: {},
      responses: {},
      aggregates: {}
    };
    describe('ADD_SURVEY', () => {
      it('should add a survey to the current list of surveys', () => {
        const survey = {
          id: 4,
          title: 'Expanded'
        };

        const action = Object.assign({}, survey, { type: 'ADD_SURVEY' });

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(Object.keys(changedState.surveys).length).to.equal(4);
        expect(changedState.surveys[survey.id]).to.deep.equal(survey);
      });
    });

    describe('REMOVE_SURVEY', () => {
      it('should remove a survey from the current list of surveys', () => {
        const action = {
          type: 'REMOVE_SURVEY',
          id: '58ee63c65a2d576d5125b4bd'
        };

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);
        expect(Object.keys(changedState.surveys).length).to.equal(2);
        expect(changedState.surveys[action.id]).to.not.exist;
      });
    });

    describe('EDIT_SURVEY', () => {
      it('should edit an existing survey in the list of surveys', () => {
        const survey = {
          id: '58ee63c65a2d576d5125b4bc',
          title: 'Fabulous'
        };

        const action = Object.assign({}, survey, { type: 'EDIT_SURVEY' });

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(Object.keys(changedState.surveys).length).to.equal(3);
        expect(changedState.surveys[survey.id].title)
          .to.equal(survey.title);
        expect(changedState.surveys['58ee63c65a2d576d5125b4bd'])
          .to.equal(initialState.surveys['58ee63c65a2d576d5125b4bd']);
        expect(changedState.surveys['58ee63c65a2d576d5125b4bf'])
          .to.equal(initialState.surveys['58ee63c65a2d576d5125b4bf']);
      });
    });
  });
  // unit tests for questions reducer
  describe('Questions', () => {
    const initialState = {
      surveys,
      questions,
      options
    };
    describe('ADD_QUESTION', () => {
      it('should add a question to the current list of questions', () => {
        const question = {
          id: '46ef6467aa8ac36d6d74fb3f',
          kind: 'Scale'
        };

        const action = Object.assign({}, question, { type: 'ADD_QUESTION' });

        deepFreeze(initialState);
        const changedState = reducer(initialState, action);
        expect(Object.keys(changedState.questions).length)
               .to.equal(Object.keys(initialState.questions).length + 1);
        expect(changedState.questions[question.id].kind).to.equal(question.kind);
      });
      it('should include required, title, min, max for SCALE questions', () => {
        const question = {
          id: '46ef6467aa8ac36d6d74fb3f',
          kind: 'Scale'
        };

        const action = Object.assign({}, question, { type: 'ADD_QUESTION' });

        deepFreeze(initialState);
        const changedState = reducer(initialState, action);
        expect(changedState.questions['46ef6467aa8ac36d6d74fb3f'].required).to.be.Boolean;
        expect(changedState.questions['46ef6467aa8ac36d6d74fb3f'].title).to.be.String;
        expect(changedState.questions['46ef6467aa8ac36d6d74fb3f'].min).to.be.Number;
        expect(changedState.questions['46ef6467aa8ac36d6d74fb3f'].max).to.be.Number;
      });
      it('should include required, title, max for TEXT questions', () => {
        const question = {
          id: '46ef6467aa8ac36d6d74fb3f',
          kind: 'Text'
        };

        const action = Object.assign({}, question, { type: 'ADD_QUESTION' });

        deepFreeze(initialState);
        const changedState = reducer(initialState, action);
        expect(changedState.questions['46ef6467aa8ac36d6d74fb3f'].required).to.be.Boolean;
        expect(changedState.questions['46ef6467aa8ac36d6d74fb3f'].title).to.be.String;
        expect(changedState.questions['46ef6467aa8ac36d6d74fb3f'].max).to.be.Number;
      });
      it('should include required, title, maxSelection for SELECT questions', () => {
        const question = {
          id: '46ef6467aa8ac36d6d74fb3f',
          kind: 'Select'
        };

        const action = Object.assign({}, question, { type: 'ADD_QUESTION' });

        deepFreeze(initialState);
        const changedState = reducer(initialState, action);
        expect(changedState.questions['46ef6467aa8ac36d6d74fb3f'].required).to.be.Boolean;
        expect(changedState.questions['46ef6467aa8ac36d6d74fb3f'].title).to.be.String;
        expect(changedState.questions['46ef6467aa8ac36d6d74fb3f'].maxSelection).to.be.Number;
      });
    });
    describe('REMOVE_QUESTION', () => {
      it('should remove a question from the current list of questions', () => {
        const action = {
          type: 'REMOVE_QUESTION',
          id: '58ee6466aa8ac36d6d74fe9f'
        };

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);
        expect(Object.keys(changedState.questions).length)
               .to.equal(Object.keys(initialState.questions).length - 1);
        expect(changedState.questions['58ee6466aa8ac36d6d74fe9f']).to.not.exist;
      });
      it('should remove options if SELECT question', () => {
        const action = {
          type: 'REMOVE_QUESTION',
          id: '58ee63c65a2d576d5125b4c1',
          kind: 'Select'
        };
        deepFreeze(initialState);
        const changedState = reducer(initialState, action);
        expect(Object.keys(changedState.options).length)
               .to.equal(Object.keys(initialState.options).length - 1);
        expect(changedState.options[action.id]).to.not.exist;
      });
    });
    describe('EDIT_QUESTION', () => {
      it('should edit an existing question in the list of questions', () => {
        const question = {
          id: '58ee63c65a2d576d5125b4c1',
          kind: 'Select',
          data: {
            title: 'Are Megan and Jin the best?',
            required: true,
            maxSelection: 1
          }
        };

        const action = Object.assign({}, question, { type: 'EDIT_QUESTION' });

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(Object.keys(changedState.questions).length)
               .to.equal(Object.keys(initialState.questions).length);
        expect(changedState.questions[question.id].id)
               .to.equal(initialState.questions[question.id].id);
        expect(changedState.questions[question.id])
               .to.not.deep.equal(initialState.questions[question.id]);
      });
      it('should edit Select questions', () => {
        const question = {
          id: '58ee63c65a2d576d5125b4c1',
          kind: 'Select',
          data: {
            title: 'Are Megan and Jin the best?',
            required: true,
            maxSelection: 1
          }
        };

        const action = Object.assign({}, question, { type: 'EDIT_QUESTION' });

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(Object.keys(changedState.questions).length)
        .to.equal(Object.keys(initialState.questions).length);
        expect(changedState.questions[question.id].title)
        .to.equal(question.data.title);
        expect(changedState.questions[question.id].required)
        .to.equal(question.data.required);
        expect(changedState.questions[question.id].maxSelection)
        .to.equal(question.data.maxSelection);
      });
      it('should edit Scale questions', () => {
        const question = {
          id: '58ee6466aa8ac36d6d74fe9f',
          kind: 'Scale',
          data: {
            title: 'How much do you like TACOS?',
            required: true,
            min: 2,
            max: 17
          }
        };

        const action = Object.assign({}, question, { type: 'EDIT_QUESTION' });

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(Object.keys(changedState.questions).length)
               .to.equal(Object.keys(initialState.questions).length);
        expect(changedState.questions[question.id].title)
               .to.equal(question.data.title);
        expect(changedState.questions[question.id].required)
               .to.equal(question.data.required);
        expect(changedState.questions[question.id].min)
               .to.equal(question.data.min);
        expect(changedState.questions[question.id].max)
               .to.equal(question.data.max);
      });
      it('should edit Text questions', () => {
        const question = {
          id: '58ee6466aa8ac36d6d74fe9e',
          kind: 'Text',
          data: {
            title: 'Tell me about your favorite fish.',
            required: true,
            max: 2000
          }
        };

        const action = Object.assign({}, question, { type: 'EDIT_QUESTION' });

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(Object.keys(changedState.questions).length)
               .to.equal(Object.keys(initialState.questions).length);
        expect(changedState.questions[question.id].title)
               .to.equal(question.data.title);
        expect(changedState.questions[question.id].required)
               .to.equal(question.data.required);
        expect(changedState.questions[question.id].max)
               .to.equal(question.data.max);
      });
      it('should not change alterable properties that are not passed inside of data for Text', () => {
        const question = {
          id: '58ee6466aa8ac36d6d74fe9e',
          kind: 'Text',
          data: {
            max: 2000
          }
        };

        const action = Object.assign({}, question, { type: 'EDIT_QUESTION' });

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(changedState.questions[question.id].max)
               .to.not.equal(initialState.questions[question.id].max);
        expect(changedState.questions[question.id].required)
               .to.equal(initialState.questions[question.id].required);
        expect(changedState.questions[question.id].title)
               .to.equal(initialState.questions[question.id].title);
      });
      it('should not change alterable properties that are not passed inside of data for Scale', () => {
        const question = {
          id: '58ee6466aa8ac36d6d74fe9f',
          kind: 'Scale',
          data: {
            max: 2000
          }
        };

        const action = Object.assign({}, question, { type: 'EDIT_QUESTION' });

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(changedState.questions[question.id].max)
               .to.not.equal(initialState.questions[question.id].max);
        expect(changedState.questions[question.id].required)
               .to.equal(initialState.questions[question.id].required);
        expect(changedState.questions[question.id].title)
               .to.equal(initialState.questions[question.id].title);
        expect(changedState.questions[question.id].min)
               .to.equal(initialState.questions[question.id].min);
      });
    });
  });
  // unit tests for options
  describe('Options', () => {
    const initialState = {
      surveys,
      questions,
      options
    };
    describe('ADD_OPTION', () => {
      it('should add a option to the current list of Select options', () => {
        const questionId = '58ee63c65a2d576d5125b4c1';
        const option = {
          questionId,
          kind: 'Select',
          id: 'k943c65a2djh895125n77r',
          label: 'Cat'
        };

        const action = Object.assign({}, option, { type: 'ADD_OPTION' });

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);
        expect(Object.keys(changedState.options[questionId]).length).to.equal(4);
        expect(changedState.options[questionId][option.id].label)
          .to.equal(option.label);
      });
      it('should not add an option for a question that is not a Select question', () => {
        const questionId = '58ee63c65a2d576d5125b4c1';
        const option = {
          questionId,
          kind: 'Scale',
          id: 'k943c65a2djh895125n77r',
          label: 'Cat'
        };

        const action = Object.assign({}, option, { type: 'ADD_OPTION' });

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(Object.keys(changedState.options[questionId]).length).to.equal(3);
        expect(changedState.options[questionId][option.id]).to.not.exist;
      });
    });
    describe('REMOVE_OPTION', () => {
      it('should remove a option from the current list of options', () => {
        const action = {
          questionId: '58ee63c65a2d576d5125b4c1',
          type: 'REMOVE_OPTION',
          kind: 'Select',
          id: '58ee6466aa8ac36d6d74fe9a'
        };

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(Object.keys(changedState.options[action.questionId]).length).to.equal(2);
        expect(changedState.options[action.questionId][action.id]).to.not.exist;
      });
    });
    describe('EDIT_OPTION', () => {
      it('should edit an existing option in the list of options', () => {
        const questionId = '58ee63c65a2d576d5125b4c1';
        const option = {
          id: '58ee6466aa8ac36d6d74fe9a',
          kind: 'Select',
          label: 'Megan and Jin are the TRUE WARRIORS'
        };

        const action = Object.assign({}, option, { type: 'EDIT_OPTION', questionId });

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(Object.keys(changedState.options[questionId]).length).to.equal(3);
        expect(changedState.options[questionId][option.id].label)
          .to.equal(option.label);
        expect(changedState.options[questionId]['58ee6466aa8ac36d6d74fe9b'].label)
          .to.equal(initialState.options[questionId]['58ee6466aa8ac36d6d74fe9b'].label);
        expect(changedState.options[questionId]['58ee6466aa8ac36d6d74fe9c'].label)
          .to.equal(initialState.options[questionId]['58ee6466aa8ac36d6d74fe9c'].label);
      });
    });
  });
  describe('Response', () => {
    const initialState = {
      surveys,
      questions,
      options,
      response
    };
    describe('ADD_ANSWER', () => {
      it('should add a new answer to an empty Scale/Text response', () => {
        const action = {
          type: 'ADD_ANSWER',
          kind: 'Scale',
          questionId: '48ff63c65a2d576d5125ff4b',
          value: 9
        };

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);
        expect(Object.keys(changedState.response).length)
               .to.equal(Object.keys(initialState.response).length + 1);
        expect(changedState.response[action.questionId].value).to.equal(action.value);
      });
      it('should overwrite a previous Scale/Text response', () => {
        const action = {
          type: 'ADD_ANSWER',
          questionId: '58ee6466aa8ac36d6d74fe9e',
          value: 'WOW what a catch I believe'
        };

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(Object.keys(changedState.response).length)
               .to.equal(Object.keys(initialState.response).length);
        expect(changedState.response[action.questionId].questionId)
               .to.equal(initialState.response[action.questionId].questionId);
        expect(changedState.response[action.questionId].value)
               .to.not.equal(initialState.response[action.questionId].value);
      });
      it('should add a new answer to a Select response', () => {
        const action = {
          type: 'ADD_ANSWER',
          questionId: '58ee63c65a2d576d5125b4c1',
          kind: 'Select',
          value: '57dd63c65a2d576d51254445'
        };

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(Object.keys(changedState.response[action.questionId].value).length)
               .to.equal(Object.keys(initialState.response[action.questionId].value).length + 1);
        expect(changedState.response[action.questionId]
              .value[action.value])
              .to.equal(action.value);
      });
    });
    describe('REMOVE_ANSWER', () => {
      it('should remove a response', () => {
        const action = {
          type: 'REMOVE_ANSWER',
          questionId: '58ee63c65a2d576d5125b4c1'
        };

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);

        expect(changedState.response[action.questionId]).to.not.exist;
        expect(Object.keys(changedState.response).length)
               .to.equal(Object.keys(initialState.response).length - 1);
      });
      it('should remove one Select response if kind and index (i) are included', () => {
        const action = {
          type: 'REMOVE_ANSWER',
          questionId: '58ee63c65a2d576d5125b4c1',
          kind: 'Select',
          id: '58ee6466aa8ac36d6d74fe9c'
        };

        deepFreeze(initialState);

        const changedState = reducer(initialState, action);
        expect(changedState.response[action.questionId]).to.exist;
        expect(Object.keys(changedState.response[action.questionId].value).length)
               .to.equal(Object.keys(initialState.response[action.questionId].value).length - 1);
      });
    });
  });
  describe('Sign In', () => {
    const initialState = {
      signin: {}
    };
    describe('TOGGLE_ERROR', () => {
      it('should toggle signin.error true/false', () => {
        const signin = {
          type: 'TOGGLE_ERROR',
          i: 0
        };

        deepFreeze(initialState);

        const changedState = reducer(initialState, signin);

        expect(changedState.signin.error)
        .to.equal(true);

        const flippedState = reducer(changedState, signin);

        expect(flippedState.signin.error)
        .to.equal(false);
      });
    });
  });
});
