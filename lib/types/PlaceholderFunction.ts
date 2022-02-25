import { DumbComponent } from './DumbComponent';
import { ReactElement } from 'react';

type PlaceholderFunction <TComponentNames extends string, TInterpolations>
  = (components: Record<TComponentNames, DumbComponent>, interpolations: TInterpolations extends object ? TInterpolations : undefined) => ReactElement;

export type {
  PlaceholderFunction
};
