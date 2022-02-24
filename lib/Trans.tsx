import { useTranslation } from 'react-i18next';
import React, { Fragment, ReactElement } from 'react';
import { renderTreeFromText } from './renderTreeFromText';
import { PlaceholderFunction } from './types/PlaceholderFunction';

interface TransProps <TComponentNames extends string, TInterpolations extends string>{
  children: PlaceholderFunction<TComponentNames, TInterpolations>;
  namespace: string;
  translation: string;
  components: Record<TComponentNames, React.FunctionComponent>;
  interpolations?: Record<TInterpolations, any>;
}

const Trans = function <TComponentNames extends string, TInterpolations extends string> ({
  children,
  translation,
  namespace,
  components,
  interpolations
}: TransProps<TComponentNames, TInterpolations>): ReactElement {
  const { t, i18n } = useTranslation(namespace);

  const resource = i18n.getResource(i18n.language, namespace, translation);

  if (!resource) {
    return children(components, interpolations);
  }

  return (
    <Fragment>
      {
        renderTreeFromText({
          text: t(translation, interpolations),
          components
        })
      }
    </Fragment>
  );
};

export {
  Trans
};
