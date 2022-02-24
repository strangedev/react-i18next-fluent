import { ReactElement } from 'react';
import { DumbComponent } from './DumbComponent';

type PlaceholderFunction <TComponentNames extends string, TInterpolations extends string>
  = (components: Record<TComponentNames, DumbComponent>, interpolations?: Record<TInterpolations, any>) => ReactElement

export type {
  PlaceholderFunction
};
