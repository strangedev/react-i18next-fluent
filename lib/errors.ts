import { defekt } from 'defekt';

class ClosingTagDoesNotMatchOpeningTag extends defekt({ code: 'ClosingTagDoesNotMatchOpeningTag' }) {}
class NotAllTagsWereClosed extends defekt({ code: 'NotAllTagsWereClosed' }) {}
class TagIsIncomplete extends defekt({ code: 'TagIsIncomplete' }) {}
class TagIsNotKnown extends defekt({ code: 'TagIsNotKnown' }) {}
class TagNameIsInvalid extends defekt({ code: 'TagNameIsInvalid' }) {}

export {
  ClosingTagDoesNotMatchOpeningTag,
  NotAllTagsWereClosed,
  TagIsIncomplete,
  TagIsNotKnown,
  TagNameIsInvalid
};
