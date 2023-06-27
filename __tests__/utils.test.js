const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("../db/seeds/utils");

const { arrangeCommentsAndArticles } = require("../models/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createRef", () => {
  test("returns an empty object, when passed an empty array", () => {
    const input = [];
    const actual = createRef(input);
    const expected = {};
    expect(actual).toEqual(expected);
  });
  test("returns a reference object when passed an array with a single items", () => {
    const input = [{ title: "title1", article_id: 1, name: "name1" }];
    let actual = createRef(input, "title", "article_id");
    let expected = { title1: 1 };
    expect(actual).toEqual(expected);
    actual = createRef(input, "name", "title");
    expected = { name1: "title1" };
    expect(actual).toEqual(expected);
  });
  test("returns a reference object when passed an array with many items", () => {
    const input = [
      { title: "title1", article_id: 1 },
      { title: "title2", article_id: 2 },
      { title: "title3", article_id: 3 },
    ];
    const actual = createRef(input, "title", "article_id");
    const expected = { title1: 1, title2: 2, title3: 3 };
    expect(actual).toEqual(expected);
  });
  test("does not mutate the input", () => {
    const input = [{ title: "title1", article_id: 1 }];
    const control = [{ title: "title1", article_id: 1 }];
    createRef(input);
    expect(input).toEqual(control);
  });
});

describe("formatComments", () => {
  test("returns an empty array, if passed an empty array", () => {
    const comments = [];
    expect(formatComments(comments, {})).toEqual([]);
    expect(formatComments(comments, {})).not.toBe(comments);
  });
  test("converts created_by key to author", () => {
    const comments = [{ created_by: "ant" }, { created_by: "bee" }];
    const formattedComments = formatComments(comments, {});
    expect(formattedComments[0].author).toEqual("ant");
    expect(formattedComments[0].created_by).toBe(undefined);
    expect(formattedComments[1].author).toEqual("bee");
    expect(formattedComments[1].created_by).toBe(undefined);
  });
  test("replaces belongs_to value with appropriate id when passed a reference object", () => {
    const comments = [{ belongs_to: "title1" }, { belongs_to: "title2" }];
    const ref = { title1: 1, title2: 2 };
    const formattedComments = formatComments(comments, ref);
    expect(formattedComments[0].article_id).toBe(1);
    expect(formattedComments[1].article_id).toBe(2);
  });
  test("converts created_at timestamp to a date", () => {
    const timestamp = Date.now();
    const comments = [{ created_at: timestamp }];
    const formattedComments = formatComments(comments, {});
    expect(formattedComments[0].created_at).toEqual(new Date(timestamp));
  });
});

describe ('arrangeCommentsAndArticles', () => {
  let inputComments;
  let inputCommentsCopy;
  let inputArticles;
  let inputArticlesCopy;
  let expected;
  beforeEach(() => {
    inputComments = [
      { article_id: 9, comment_id: 1 },
      { article_id: 1, comment_id: 2 },
      { article_id: 1, comment_id: 3 },
      { article_id: 1, comment_id: 4 },
      { article_id: 1, comment_id: 5 },
      { article_id: 1, comment_id: 6 },
      { article_id: 1, comment_id: 7 },
      { article_id: 1, comment_id: 8 },
      { article_id: 1, comment_id: 9 },
      { article_id: 3, comment_id: 10 },
      { article_id: 3, comment_id: 11 },
      { article_id: 1, comment_id: 12 },
      { article_id: 1, comment_id: 13 },
      { article_id: 5, comment_id: 14 },
      { article_id: 5, comment_id: 15 },
      { article_id: 6, comment_id: 16 },
      { article_id: 9, comment_id: 17 },
      { article_id: 1, comment_id: 18 }
    ];
    inputCommentsCopy = [
      { article_id: 9, comment_id: 1 },
      { article_id: 1, comment_id: 2 },
      { article_id: 1, comment_id: 3 },
      { article_id: 1, comment_id: 4 },
      { article_id: 1, comment_id: 5 },
      { article_id: 1, comment_id: 6 },
      { article_id: 1, comment_id: 7 },
      { article_id: 1, comment_id: 8 },
      { article_id: 1, comment_id: 9 },
      { article_id: 3, comment_id: 10 },
      { article_id: 3, comment_id: 11 },
      { article_id: 1, comment_id: 12 },
      { article_id: 1, comment_id: 13 },
      { article_id: 5, comment_id: 14 },
      { article_id: 5, comment_id: 15 },
      { article_id: 6, comment_id: 16 },
      { article_id: 9, comment_id: 17 },
      { article_id: 1, comment_id: 18 }
    ];
    inputArticles = [
      { article_id: 1 },
      { article_id: 2 },
      { article_id: 3 },
      { article_id: 4 },
      { article_id: 5 },
      { article_id: 6 },
      { article_id: 7 },
      { article_id: 8 },
      { article_id: 9 },
      { article_id: 10 },
      { article_id: 11 },
      { article_id: 12 },
      { article_id: 13 }
    ]
    inputArticlesCopy = [
      { article_id: 1 },
      { article_id: 2 },
      { article_id: 3 },
      { article_id: 4 },
      { article_id: 5 },
      { article_id: 6 },
      { article_id: 7 },
      { article_id: 8 },
      { article_id: 9 },
      { article_id: 10 },
      { article_id: 11 },
      { article_id: 12 },
      { article_id: 13 }
    ]
    expected = {
      '1': 11,
      '2': 0,
      '3': 2,
      '4': 0,
      '5': 2,
      '6': 1,
      '7': 0,
      '8': 0,
      '9': 2,
      '10': 0,
      '11': 0,
      '12': 0,
      '13': 0
    }
  });
  test('returns correct reference object', () => {
    const actual = arrangeCommentsAndArticles(inputComments, inputArticles);
    expect(actual).toEqual(expected);
  });
  test('returns a NEW object', () => {
    const actual = arrangeCommentsAndArticles(inputComments, inputArticles);
    expect(actual).not.toBe(inputComments);
    expect(actual).not.toBe(inputArticles);
  });
  test('does not mutate original arrays and objects', () => {
    arrangeCommentsAndArticles(inputComments, inputArticles);
    expect(inputComments).toEqual(inputCommentsCopy);
    expect(inputArticles).toEqual(inputArticlesCopy);
    for(let i = 0; i < inputComments.length; i ++) {
      expect(inputComments[i]).toEqual(inputCommentsCopy[i]);
    }
    for(let i = 0; i < inputArticles.length; i ++) {
      expect(inputArticles[i]).toEqual(inputArticlesCopy[i]);
    }
  });
});