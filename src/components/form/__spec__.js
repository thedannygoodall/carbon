import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';
import Form from './form';
import Textbox from './../textbox';
import Validation from './../../utils/validations/presence';
import ImmutableHelper from './../../utils/helpers/immutable';
import Dialog from './../dialog';

describe('Form', () => {
  let instance;

  beforeEach(() => {
    instance = TestUtils.renderIntoDocument(
      <Form />
    );
  });

  describe('initialize', () => {
    it('sets the errorCount to 0', () => {
      expect(instance.state.errorCount).toEqual(0);
    });
  });

  describe('incrementErrorCount', () => {
    it('increments the state error count', () => {
      instance.setState({ errorCount: 2 });
      instance.incrementErrorCount();
      expect(instance.state.errorCount).toEqual(3);
    });
  });

  describe('decrementErrorCount', () => {
    it('increments the state error count', () => {
      instance.setState({ errorCount: 2 });
      instance.decrementErrorCount();
      expect(instance.state.errorCount).toEqual(1);
    });
  });

  describe('attachToForm', () => {
    let textbox;

    beforeEach(() => {
      instance = TestUtils.renderIntoDocument(
        <Form><Textbox validations={ [Validation()] } value='' /></Form>
      );
      textbox = TestUtils.findRenderedComponentWithType(instance, Textbox);
    });

    describe('when the component is self contained', () => {
      it('adds a input by its guid', () => {
        expect(instance.inputs[textbox._guid]).toBeTruthy();
      });
    });
  });

  describe('detachFromForm', () => {
    let grid;
    let excludedTextbox;

    beforeEach(() => {
      instance = TestUtils.renderIntoDocument(
        <Form>
          <Textbox validations={ [Validation()] } value='' />
        </Form>
      );

      excludedTextbox = TestUtils.findRenderedComponentWithType(instance, Textbox);
    });

    describe('when the component is self contained', () => {
      it('removes a input by its guid', () => {
        expect(instance.inputs[excludedTextbox._guid]).toBeTruthy();
        instance.detachFromForm(instance.inputs[excludedTextbox._guid]);
        expect(instance.inputs[excludedTextbox._guid]).toBeFalsy();
      });
    });
  });

  describe('serialize', () => {
    beforeEach(() => {
      instance = TestUtils.renderIntoDocument(
        <Form>
          <Textbox name='model[test]' value='foo' />
        </Form>
      );
    });

    it('without opts it returns a string', () => {
      expect(instance.serialize()).toEqual('model%5Btest%5D=foo');
    });

    it('with opts it returns a hash', () => {
      expect(instance.serialize({ hash: true })).toEqual({ model: { test: 'foo' } });
    });
  });

  describe('handleOnSubmit', () => {
    describe('invalid input', () => {
      it('does not not submit the form', () => {
        instance = TestUtils.renderIntoDocument(
          <Form>
            <Textbox validations={ [Validation()] } name='test' value='' />
          </Form>
        );

        spyOn(instance, 'setState');
        let form = TestUtils.findRenderedDOMComponentWithTag(instance, 'form');
        TestUtils.Simulate.submit(form);
        expect(instance.setState).toHaveBeenCalledWith({ errorCount: 1 });
      });
    });

    describe('disabled input', () => {
      it('does not validate the input', () => {
        instance = TestUtils.renderIntoDocument(
          <Form>
            <Textbox validations={ [Validation()] } disabled={ true } />
          </Form>
        );

        let textbox = TestUtils.findRenderedComponentWithType(instance, Textbox);
        let form = TestUtils.findRenderedDOMComponentWithTag(instance, 'form');
        spyOn(textbox, 'validate');
        TestUtils.Simulate.submit(form);
        expect(textbox.validate).not.toHaveBeenCalled();
      });
    });

    describe('when a beforeFormValidation prop is passed', () => {
      it('calls the beforeFormValidation', () => {
        let spy = jasmine.createSpy('spy');
        instance = TestUtils.renderIntoDocument(
          <Form beforeFormValidation={ spy }>
            <Textbox validations={ [Validation()] } name='test' value='Valid' />
          </Form>
        );
        let form = TestUtils.findRenderedDOMComponentWithTag(instance, 'form');
        TestUtils.Simulate.submit(form);
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('when a afterFormValidation prop is passed', () => {
      it('calls the afterFormValidation', () => {
        let spy = jasmine.createSpy('spy');
        instance = TestUtils.renderIntoDocument(
          <Form afterFormValidation={ spy }>
            <Textbox validations={ [Validation()] } name='test' value='Valid' />
          </Form>
        );
        let form = TestUtils.findRenderedDOMComponentWithTag(instance, 'form');
        TestUtils.Simulate.submit(form);
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('htmlProps', () => {
    it('sets the className', () => {
      expect(instance.htmlProps().className).toEqual('ui-form');
    });
  });

  describe('cancelForm', () => {
    describe('when window history is availiable', () => {
      it('redirects to the previous page', () => {
        spyOn(instance._window.history, 'back')
        let cancel = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'button')[0];
        TestUtils.Simulate.click(cancel);
        expect(instance._window.history.back).toHaveBeenCalled();
      });
    });

    describe('when window history is not availiable', () => {
      it('throws an error', () => {
        instance._window = {};
        let cancel = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'button')[0];
        expect(function() { TestUtils.Simulate.click(cancel) }).toThrowError('History is not defined. This is normally configured by the react router');
      });
    });

    describe('when the form is inside a dialog', () => {
      it('uses the dialogs cancel handler instead', () => {
        let spy = jasmine.createSpy('onCancel');
        let nestedInstance = TestUtils.renderIntoDocument(
          <Dialog
            title="test"
            open={ true }
            onCancel={ spy }>

            <Form>
              <Textbox
                name="name"
                onChange={ function() {} }
                value={ 'foo' } />
            </Form>
          </Dialog>
        )
        let cancel = TestUtils.scryRenderedDOMComponentsWithTag(nestedInstance, 'button')[0];
        TestUtils.Simulate.click(cancel);
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('mainClasses', () => {
    it('returns the ui-form class', () => {
      expect(instance.mainClasses).toEqual('ui-form');
    });
  });

  describe('render', () => {
    it('renders a parent form', () => {
      let form = TestUtils.findRenderedDOMComponentWithTag(instance, 'form')
      expect(form.className).toEqual('ui-form');
    });

    describe('CSRF', () => {
      let csrf;

      beforeEach(() => {
        let fakeMeta1 = { getAttribute() {} },
            fakeMeta2 = { getAttribute() {} };

        spyOn(fakeMeta1, 'getAttribute').and.returnValue('csrf-param')
        spyOn(fakeMeta2, 'getAttribute').and.returnValue('csrf-token')
        spyOn(instance._document, 'getElementsByTagName').and.returnValue( [ fakeMeta1, fakeMeta2 ] );

        instance = TestUtils.renderIntoDocument(<Form />);

        csrf = TestUtils.findRenderedDOMComponentWithTag(instance, 'input');
      });

      it('renders a hidden CSRFToken field', () => {
        expect(csrf.type).toEqual('hidden');
        expect(csrf.readOnly).toBeTruthy();
      });

      describe('when meta tag name == csrf-param', () => {
        it('adds the meta tag content as the name of the input field', () => {
          expect(csrf.name).toEqual('csrf-param');
        });
      });

      describe('when meta tag name == csrf-token', () => {
        it('adds the meta tag content as the value of the input field', () => {
          expect(csrf.value).toEqual('csrf-token');
        });
      });
    });

    describe('buttons', () => {
      let buttons;
      let buttonContainers;

      beforeEach(() => {
        buttons = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'button')
        buttonContainers = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'div');
      });

      it('renders two buttons', () => {
        expect(buttons.length).toEqual(2);
      });

      it('renders a secondary cancel button with cancelClasses', () => {
        expect(buttons[0].className).toEqual('ui-button ui-button--secondary');
        expect(buttonContainers[0].className).toEqual('ui-form__cancel');
      });

      it('renders a primary save button with saveClasses', () => {
        expect(buttons[1].className).toEqual('ui-button ui-button--primary');
        expect(buttonContainers[1].className).toEqual('ui-form__save');
      });

      it('renders an undisabled save button if not submitting', () => {
        expect(buttons[1].disabled).toBeFalsy();
      });

      it('renders a disabled save button if saving', () => {
        instance = TestUtils.renderIntoDocument(
          <Form saving={true} />
        );
        buttons = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'button')
        expect(buttons[1].disabled).toBeTruthy();
      });
    });

    describe('Cancel Button', () => {
      describe('when cancel prop is false', () => {
        beforeEach(() => {
          instance = TestUtils.renderIntoDocument(
            <Form cancel={false} />
          );
        });

        it('does not show a cancel button', () => {
          let buttons = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'button')
          expect(buttons.length).toEqual(1);
        });
      });

      describe('when cancel props is true (default)', () => {
        it('does show a cancel button', () => {
          let buttons = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'button')
          expect(buttons.length).toEqual(2);
        });
      });
    });

    describe('errorMessage', () => {
      beforeEach(() => {
        instance.setState({ errorCount: 2});
      });

      it('displays an error message', () => {
        let summary = TestUtils.findRenderedDOMComponentWithClass(instance, 'ui-form__summary')
        expect(summary.textContent).toEqual('There are 2 errors');
      });

      it('adds a invalid CSS class on the Save button div', () => {
        let saveContainer = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'div')[1];
        expect(saveContainer.className).toEqual('ui-form__save ui-form__save--invalid');
      });
    });
  });
});
