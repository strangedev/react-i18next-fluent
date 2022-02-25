import { PlaceholderFunction } from './types/PlaceholderFunction';
import { renderTreeFromText } from './renderTreeFromText';
import { useTranslation } from 'react-i18next';
import React, { Fragment, ReactElement } from 'react';

interface TransProps <TComponentNames extends string, TInterpolations>{
  children: PlaceholderFunction<TComponentNames, TInterpolations>;
  namespace: string;
  translation: string;
  components: Record<TComponentNames, React.FunctionComponent>;
  interpolations?: TInterpolations;
}

const Trans = function <TComponentNames extends string, TInterpolations> ({
  children,
  translation,
  namespace,
  components,
  interpolations
}: TransProps<TComponentNames, TInterpolations>): ReactElement {
  const { t, i18n } = useTranslation(namespace);
  const resource = i18n.getResource(i18n.language, namespace, translation);

  if (!resource) {
    // @ts-expect-error: The types are always correct, but TS doesn't get it.
    return children(components, interpolations);
  }

  try {
    const renderedTree = renderTreeFromText({
      text: t(translation, interpolations),
      components
    });

    return (
      // eslint-disable-next-line react/jsx-no-useless-fragment
      <Fragment>
        { ...renderedTree }
      </Fragment>
    );
  } catch {
    // @ts-expect-error: The types are always correct, but TS doesn't get it.
    return children(components, interpolations);
  }
};

export {
  Trans
};
