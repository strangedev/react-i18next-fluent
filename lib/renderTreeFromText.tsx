import { ClosingTagDoesNotMatchOpeningTag, NotAllTagsWereClosed, TagIsIncomplete, TagIsNotKnown, TagNameIsInvalid } from './errors';
import { Tag } from './types/Tag';
import React, { ReactNode } from 'react';

const renderTreeFromText = ({
  text,
  components
}: {
  text: string;
  components: Record<string, React.FunctionComponent>;
}): ReactNode[] => {
  const openTags: Tag[] = [
    {
      name: 'root',
      children: []
    }
  ];

  let currentTextPart = '';

  for (let i = 0; i < text.length;) {
    const nextChar = text[i];
    const remainingChars = text.length - i;

    if (nextChar !== '<') {
      currentTextPart += nextChar;
      i += 1;

      continue;
    }

    if (i + 1 === text.length) {
      throw new TagIsIncomplete({ data: { position: i } });
    }

    const isClosingTag = text[i + 1] === '/';

    if (!isClosingTag) {
      const currentlyOpenTag = openTags.at(0);

      if (currentTextPart.length > 0) {
        currentlyOpenTag!.children.push(currentTextPart);
        currentTextPart = '';
      }

      let tag = '';
      let readChars = 0;

      for (; readChars < remainingChars; readChars++) {
        const nextTagChar = text[i + readChars];

        tag += nextTagChar;

        if (nextTagChar === '>') {
          break;
        }

        if (readChars + 1 === remainingChars) {
          throw new TagIsIncomplete({
            data: {
              position: i,
              tag: tag.slice(1)
            }
          });
        }
      }

      const tagName = tag.slice(1, -1);

      if (!/^[a-zA-Z]\w*$/gm.test(tagName)) {
        throw new TagNameIsInvalid({
          data: {
            tag: tagName,
            position: i
          }
        });
      }

      openTags.unshift({
        name: tagName,
        children: []
      });
      i += readChars + 1;

      continue;
    }

    let tag = '';
    let readChars = 0;

    for (; readChars < remainingChars; readChars++) {
      const nextTagChar = text[i + readChars];

      tag += nextTagChar;

      if (nextTagChar === '>') {
        break;
      }

      if (readChars + 1 === remainingChars) {
        throw new TagIsIncomplete({
          data: {
            position: i,
            tag: tag.slice(2)
          }
        });
      }
    }

    const tagName = tag.slice(2, -1);
    const closedTag = openTags.shift();

    if (!/^[a-zA-Z]\w*$/gm.test(tagName)) {
      throw new TagNameIsInvalid({
        data: {
          tag: tagName,
          position: i
        }
      });
    }

    if (tagName !== closedTag!.name) {
      throw new ClosingTagDoesNotMatchOpeningTag({
        data: {
          position: i,
          tag: tagName,
          openTags
        }
      });
    }

    if (currentTextPart.length > 0) {
      closedTag!.children.push(currentTextPart);
      currentTextPart = '';
    }

    const Component = components[tagName];

    if (!Component) {
      throw new TagIsNotKnown({
        data: {
          tag: tagName,
          position: i
        }
      });
    }

    const renderedClosedTag = (<Component>{ ...closedTag!.children }</Component>);
    const currentlyOpenTag = openTags.at(0);

    currentlyOpenTag!.children.push(renderedClosedTag);

    i += readChars + 1;
  }

  if (openTags.length > 1) {
    throw new NotAllTagsWereClosed({ data: { openTags } });
  }

  const root = openTags.shift();

  if (currentTextPart.length > 0) {
    root!.children.push(currentTextPart);
  }

  return root!.children;
};

export {
  renderTreeFromText
};
