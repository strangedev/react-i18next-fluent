# react-i18next-fluent

A translation component for `react-i18next` with an API for humans.

## Introduction

Translating react apps with `i18next` can be challenging.
Trivial cases can be solved by using the `t` function directly in your markup.
This is however limited to cases where the structure of the markup doesn't
change depending on the translation.
For these complex cases, `react-i18next` provides the `Trans` component.
With it, we can name the components we want to use and write markup directly
into our translation strings, e.g.:

```json
{
  "welcome": "Hey there <0>{{ name }}</0>, we're <1>thrilled</1> to see you."
}
```

While this provides the flexibility we need, the JSX itself becomes cryptic and
doesn't show us what is rendered in any idiomatic way anymore, e.g.:

```tsx
<Trans
  i18nkey='welcome'
  values={{ name: 'Gunnar' }}
  components:={[ <b>name</b>, <i>placeholder</i> ]}
/>
```

Using this library we can have both, an idiomatic and readable fallback in JSX,
and the ability to change what is being rendered using translation resources.

It looks like this:

```tsx
<Trans
  namespace='app'
  translation='welcome'
  components={{
    Bold: ({ children }) => <b>{ children }</b>,
    Italic: ({ children }) => <i>{ children }</i>
  }}
  interpolations={{
    name: 'Gunnar'
  }}
>
  {(t, { name }) => (<>
    Hey there, <t.Bold>{ name }</t.Bold>, we're <t.Italic>thrilled</t.Italic> to see you!
  </>)}
</Trans>
```

```json
{
  "welcome": "Hi <Bold>{{ name }}</Bold>, wir sind <Italic>begeistert</Italic> dich zu sehen!"
}
```

## Getting started

Install via npm or yarn:

```shell
npm install @nhummel/react-i18next-fluent
```

## Using the component

In your `react-i18next` enabled application, import the `Trans` component:

```tsx
import { Trans } from '@nhummel/react-i18next-fluent';
```

To use the component, you have to specify the namespace and translation key it
should use. This will be used to look up the translation from your configured
resource bundles.

```tsx
import { Trans } from '@nhummel/react-i18next-fluent';

<Trans
  namespace='app'
  translation='welcome'
>
  /* ... */
</Trans>
```

### Writing the placeholder

In the absence of suitable translations, either because you haven't written them
yet, or they couldn't be loaded for some reason, the component will render the
placeholder function passed to it as children:

```tsx
import { Trans } from '@nhummel/react-i18next-fluent';

<Trans
  namespace='app'
  translation='welcome'
>
  {(): ReactElement => (<>
    This is a placeholder. It may contain <i>any</i> valid JSX.
    It will be rendered by default.
    Be sure to wrap multiple elements in a Fragment! 
  </>)}
</Trans>
```

While you can use any components you want inside the placeholder, you should
pass all used components using the `components` property. That way, you can also
use them when writing your translation resources later. You can use any valid
`Component` constructor, like a `FunctionComponent`.
You may access the components in the placeholder using the first parameter
of the render function:

```tsx
import { Trans } from '@nhummel/react-i18next-fluent';

<Trans
  namespace='app'
  translation='placeholder'
  components={{
    Italic: ({ children }) => <i>{ children }</i>
  }}
>
  {(t): ReactElement => (<>
    This is a placeholder. It may contain <t.Italic>any</t.Italic> valid JSX.
    It will be rendered by default.
    Be sure to wrap multiple elements in a Fragment!
  </>)}
</Trans>
```

### Writing translations

After writing the Placeholder, you're good to go. Your application will
always fall back to the placeholder, so you can take your time while writing
translation resources.

To provide alternative translations, you simply write them into your translation
resources as usual. The only difference is that you may also include any of the
components you pass to the `Trans` component in you translations:

```json
{
  "welcome": "Hi <Bold>{{ name }}</Bold>, wir sind <Italic>begeistert</Italic> dich zu sehen!"
}
```

You can use and re-use these components freely, and even nest them:

```json
{
  "welcome": "Hi <Bold>{{ name }}</Bold>, wir sind <Italic><Bold>begeistert</Bold></Italic> dich zu sehen!"
}
```

If you mess up the syntax the placeholder will be used, so don't worry too much
and start experimenting!

### Using interpolations

You can also use interpolations to place values into your translated content.
You simply pass an object containing these values to the `Trans` component.
You can access the values in the placeholder using the second argument of the
render function:

```tsx
import { Trans } from '@nhummel/react-i18next-fluent';

<Trans
  namespace='app'
  translation='braggadocious'
  components={{
    Monospaced
  }}
  interpolations={{
    reasonsCount: 3
  }}
>
  {(t, { reasonsCount }): ReactElement => (<>
    There are { reasonsCount } good reasons to use <t.Monospaced>react-i18next-fluent</t.Monospaced>!
  </>)}
</Trans>
```

You can also access the values in your translation resources as usual:

```json
{
  "braggadocious": "Es gibt {{ reasonsCount }} gute Gründe, <Monospaced>react-i18next-fluent</Monospaced> zu verwenden!"
}
```

## Caveats

At the moment, pluralization and contexts are not supported, as I'm not entirely
sure how these features would integrate with this library. If you've got ideas,
please share them in the issues!

## Contributing

Feel free to open an issue or a pull request.

### Running quality assurance

```shell
npx roboter
```
