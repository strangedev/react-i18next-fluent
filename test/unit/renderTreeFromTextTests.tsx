import { render } from '@testing-library/react';
import { assert } from 'assertthat';
import React, { Fragment, FunctionComponent, ReactElement } from 'react';
import { ClosingTagDoesNotMatchOpeningTag, NotAllTagsWereClosed, TagIsIncomplete, TagIsNotKnown, TagNameIsInvalid } from '../../lib/errors';
import { renderTreeFromText } from '../../lib/renderTreeFromText';

suite('renderTreeFromText', (): void => {
  suite('successful cases', (): void => {
    test('renders nothing when no text is given.', async (): Promise<void> => {
      const text = '';
      const components = {};

      assert.that(renderTreeFromText({ text, components })).is.equalTo([]);
    });
    test('renders just the text if no tags are used.', async (): Promise<void> => {
      const text = 'Text without tags';
      const components = {};

      assert.that(renderTreeFromText({ text, components })).is.equalTo([ text ]);
    });
    test('renders the text using the given components as replacements for the tags.', async (): Promise<void> => {
      const text = 'Text with <Bold>tags</Bold>, some <Bold>are even <Italic>nested</Italic></Bold>!';

      const Bold: FunctionComponent = ({ children }): ReactElement => <b>{ children }</b>;
      const Italic: FunctionComponent = ({ children }): ReactElement => <i>{ children }</i>

      const components = { Bold, Italic };

      let { container } = render(
        <Fragment>
          Text with <Bold>tags</Bold>, some <Bold>are even <Italic>nested</Italic></Bold>!
        </Fragment>
      );
      const expected = container.innerHTML;

      ({ container } = render(
        <Fragment>
          {...renderTreeFromText({ text, components })}
        </Fragment>
      ));
      const actual = container.innerHTML;

      assert.that(actual).is.equalTo(expected);
    });
  });
  suite('error cases', () => {
    test('throws TagIsIncomplete when the opening bracket is followed by no more characters.', async (): Promise<void> => {
      const text = 'This is invalid <';
      const components = {};

      assert.that(() => {
        renderTreeFromText({ text, components });
      }).is.throwing(new TagIsIncomplete().message);
    });
    test('throws TagIsIncomplete when the opening bracket of an opening tag is never followed by a closing bracket.', async (): Promise<void> => {
      const text = 'This is <invalid';
      const components = {};

      assert.that(() => {
        renderTreeFromText({ text, components });
      }).is.throwing(new TagIsIncomplete().message);
    });
    test('throws TagIsIncomplete when the opening bracket of a closing tag is never followed by a closing bracket.', async (): Promise<void> => {
      const text = 'This is <invalid> input </invalid';
      const components = {};

      assert.that(() => {
        renderTreeFromText({ text, components });
      }).is.throwing(new TagIsIncomplete().message);
    });
    test('throws TagNameIsInvalid when the tag starts with a digit.', async (): Promise<void> => {
      const text = 'This is an invalid <3tag> :/ </3tag>';
      const components = {};

      assert.that(() => {
        renderTreeFromText({ text, components });
      }).is.throwing(new TagNameIsInvalid().message);
    });
    test('throws TagNameIsInvalid when the tag contains any non alphanumeric characters.', async (): Promise<void> => {
      const text = 'This is invalid <tag<> :/ </tag<>';
      const components = {};

      assert.that(() => {
        renderTreeFromText({ text, components });
      }).is.throwing(new TagNameIsInvalid().message);
    });
    test('throws ClosingTagDoesNotMatchOpeningTag when a tag is closed but no tag is open.', async (): Promise<void> => {
      const text = 'This is invalid </tag>';
      const components = {};

      assert.that(() => {
        renderTreeFromText({ text, components });
      }).is.throwing(new ClosingTagDoesNotMatchOpeningTag().message);
    });
    test('throws ClosingTagDoesNotMatchOpeningTag when a tag is closed but another tag is open.', async (): Promise<void> => {
      const text = 'This is <tag><p> invalid </tag></p>';
      const components = {};

      assert.that(() => {
        renderTreeFromText({ text, components });
      }).is.throwing(new ClosingTagDoesNotMatchOpeningTag().message);
    });
    test('throws NotAllTagsWereClosed when a tag is never closed.', async (): Promise<void> => {
      const text = 'This is <invalid>';
      const components = {};

      assert.that(() => {
        renderTreeFromText({ text, components });
      }).is.throwing(new NotAllTagsWereClosed().message);
    });
    test('throws TagIsNotKnown when a tag has no corresponding component.', async (): Promise<void> => {
      const text = 'This is <valid> text </valid>';
      const components = {};

      assert.that(() => {
        renderTreeFromText({ text, components });
      }).is.throwing(new TagIsNotKnown().message);
    });
  });
});