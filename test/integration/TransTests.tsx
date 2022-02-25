import { assert } from 'assertthat';
import i18n from 'i18next';
import { Trans } from '../../lib';
import { cleanup, render, waitFor } from '@testing-library/react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import React, { Fragment, FunctionComponent, ReactElement } from 'react';

const Bold: FunctionComponent = ({ children }): ReactElement => <b>{ children }</b>;
const Italic: FunctionComponent = ({ children }): ReactElement => <i>{ children }</i>;

suite('Trans', (): void => {
  suiteSetup(async (): Promise<void> => {
    await i18n.
      use(initReactI18next).
      init({
        lng: 'en',
        fallbackLng: 'en',
        ns: [ 'common' ],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        defaultNS: 'common',
        interpolation: {
          escapeValue: false
        },
        resources: {
          de: {
            common: {
              greeting: 'Grüße, <Bold>Isaac</Bold>. Wir sind <Italic>ganz aus dem Häuschen</Italic> dich wiederzusehen!'
            }
          },
          it: {
            common: {
              greeting: '<Bold>Ciao</Bold> <Bold>Isaac</Bold>, siamo <Italic>entusiasti</Italic> di riaverti con noi.'
            }
          },
          fr: {
            common: {
              greeting: 'Salut <Bold>Isaac</Bold>, nous sommes <Italic><Bold>ravis</Bold></Italic> de vous revoir.'
            }
          },
          dk: {
            common: {
              greeting: 'Hej, <Bold><Italic>Isaac</Bold></Italic>, vi er glade for at have dig tilbage.'
            }
          },
          nl: {
            common: {
              greeting: 'Hey daar <Bold>{{ name }}</Bold>, we zijn <Italic>blij</Italic> dat je terug bent.'
            }
          }
        }
      });
  });

  teardown(async (): Promise<void> => {
    cleanup();
  });

  test('uses the placeholder when no translation resource is provided.', async (): Promise<void> => {
    await i18n.changeLanguage('en');

    let { container } = render(
      <I18nextProvider i18n={ i18n }>
        <Trans
          namespace='common'
          translation='invalid'
          components={{
            Bold,
            Italic
          }}
        >
          {
            (t): ReactElement => (
              <Fragment>
                Hey there, <t.Bold>Isaac</t.Bold>, we&apos;re <t.Italic>thrilled</t.Italic> to have you back!
              </Fragment>
            )
          }
        </Trans>
      </I18nextProvider>
    );

    const rendered = container.innerHTML;

    ({ container } = render(<Fragment>Hey there, <b>Isaac</b>, we&apos;re <i>thrilled</i> to have you back!</Fragment>));

    const expected = container.innerHTML;

    assert.that(rendered).is.equalTo(expected);
  });
  test('uses a translation resource when available.', async (): Promise<void> => {
    await i18n.changeLanguage('de');

    let { container } = render(
      <I18nextProvider i18n={ i18n }>
        <Trans
          namespace='common'
          translation='greeting'
          components={{
            Bold,
            Italic
          }}
        >
          {
            (t): ReactElement => (
              <Fragment>
                Hey there, <t.Bold>Isaac</t.Bold>, we&apos;re <t.Italic>thrilled</t.Italic> to have you back!
              </Fragment>
            )
          }
        </Trans>
      </I18nextProvider>
    );

    const rendered = container.innerHTML;

    ({ container } = render(<Fragment>Grüße, <b>Isaac</b>. Wir sind <i>ganz aus dem Häuschen</i> dich wiederzusehen!</Fragment>));

    const expected = container.innerHTML;

    assert.that(rendered).is.equalTo(expected);
  });
  test('supports re-using components.', async (): Promise<void> => {
    await i18n.changeLanguage('it');

    let { container } = render(
      <I18nextProvider i18n={ i18n }>
        <Trans
          namespace='common'
          translation='greeting'
          components={{
            Bold,
            Italic
          }}
        >
          {
            (t): ReactElement => (
              <Fragment>
                Hey there, <t.Bold>Isaac</t.Bold>, we&apos;re <t.Italic>thrilled</t.Italic> to have you back!
              </Fragment>
            )
          }
        </Trans>
      </I18nextProvider>
    );

    const rendered = container.innerHTML;

    ({ container } = render(<Fragment><b>Ciao</b> <b>Isaac</b>, siamo <i>entusiasti</i> di riaverti con noi.</Fragment>));

    const expected = container.innerHTML;

    assert.that(rendered).is.equalTo(expected);
  });
  test('Allows different translations to have different structures.', async (): Promise<void> => {
    await i18n.changeLanguage('fr');

    let { container } = render(
      <I18nextProvider i18n={ i18n }>
        <Trans
          namespace='common'
          translation='greeting'
          components={{
            Bold,
            Italic
          }}
        >
          {
            (t): ReactElement => (
              <Fragment>
                Hey there, <t.Bold>Isaac</t.Bold>, we&apos;re <t.Italic>thrilled</t.Italic> to have you back!
              </Fragment>
            )
          }
        </Trans>
      </I18nextProvider>
    );

    const rendered = container.innerHTML;

    ({ container } = render(<Fragment>Salut <b>Isaac</b>, nous sommes <i><b>ravis</b></i> de vous revoir.</Fragment>));

    const expected = container.innerHTML;

    assert.that(rendered).is.equalTo(expected);
  });
  test('passes interpolations to the placeholder.', async (): Promise<void> => {
    await i18n.changeLanguage('en');

    let { container } = render(
      <I18nextProvider i18n={ i18n }>
        <Trans
          namespace='common'
          translation='invalid'
          components={{
            Bold,
            Italic
          }}
          interpolations={{
            name: 'Zach'
          }}
        >
          {
            (t, { name }): ReactElement => (
              <Fragment>
                Hey there, <t.Bold>{ name }</t.Bold>, we&apos;re <t.Italic>thrilled</t.Italic> to have you back!
              </Fragment>
            )
          }
        </Trans>
      </I18nextProvider>
    );

    const rendered = container.innerHTML;

    ({ container } = render(<Fragment>Hey there, <b>Zach</b>, we&apos;re <i>thrilled</i> to have you back!</Fragment>));

    const expected = container.innerHTML;

    assert.that(rendered).is.equalTo(expected);
  });
  test('applies interpolations to translation resources.', async (): Promise<void> => {
    await i18n.changeLanguage('nl');

    let { container } = render(
      <I18nextProvider i18n={ i18n }>
        <Trans
          namespace='common'
          translation='greeting'
          components={{
            Bold,
            Italic
          }}
          interpolations={{
            name: 'Gustav'
          }}
        >
          {
            (t, { name }): ReactElement => (
              <Fragment>
                Hey there, <t.Bold>{ name }</t.Bold>, we&apos;re <t.Italic>thrilled</t.Italic> to have you back!
              </Fragment>
            )
          }
        </Trans>
      </I18nextProvider>
    );

    const rendered = container.innerHTML;

    ({ container } = render(<Fragment>Hey daar <b>Gustav</b>, we zijn <i>blij</i> dat je terug bent.</Fragment>));

    const expected = container.innerHTML;

    assert.that(rendered).is.equalTo(expected);
  });
  test('re-renders when the i18n context changes language.', async (): Promise<void> => {
    await i18n.changeLanguage('de');

    const { getByText } = render(
      <I18nextProvider i18n={ i18n }>
        <Trans
          namespace='common'
          translation='greeting'
          components={{
            Bold,
            Italic
          }}
        >
          {
            (t): ReactElement => (
              <Fragment>
                Hey there, <t.Bold>Isaac</t.Bold>, we&apos;re <t.Italic>thrilled</t.Italic> to have you back!
              </Fragment>
            )
          }
        </Trans>
      </I18nextProvider>
    );

    await waitFor((): void => {
      assert.that(getByText('ganz aus dem Häuschen')).is.not.undefined();
    });

    await i18n.changeLanguage('en');

    await waitFor((): void => {
      assert.that(getByText('thrilled')).is.not.undefined();
    });
  });
  test('falls back to the placeholder if the provided translation resource is malformed.', async (): Promise<void> => {
    await i18n.changeLanguage('dk');

    let { container } = render(
      <I18nextProvider i18n={ i18n }>
        <Trans
          namespace='common'
          translation='greeting'
          components={{
            Bold,
            Italic
          }}
        >
          {
            (t): ReactElement => (
              <Fragment>
                Hey there, <t.Bold>Isaac</t.Bold>, we&apos;re <t.Italic>thrilled</t.Italic> to have you back!
              </Fragment>
            )
          }
        </Trans>
      </I18nextProvider>
    );

    const rendered = container.innerHTML;

    ({ container } = render(<Fragment>Hey there, <b>Isaac</b>, we&apos;re <i>thrilled</i> to have you back!</Fragment>));

    const expected = container.innerHTML;

    assert.that(rendered).is.equalTo(expected);
  });
});
