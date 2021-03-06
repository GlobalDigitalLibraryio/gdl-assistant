const { Image } = require("actions-on-google");
const utils = require("../gdl/utils");
const books = require("./books.json");

describe("test findFirstReadablePageInBook", () => {
  it("should sort chapters and return the first", () => {
    // OBS: This test is related to what logic 'findFirstReadablePageInBook' has. Until we have decided whats the best...
    // If it returns the cover page the values should be: id: 153, seqNo: 2, url:....../chapters/153
    //  if it returns the first readable page it should be: id: 154, seqNo: 2, url: ..../chapters/154
    expect(utils.findFirstReadablePageInBook(books[0])).toEqual({
      id: 154,
      seqNo: 2,
      url:
        "https://api.test.digitallibrary.io/book-api/v1/books/en/11/chapters/154"
    });
  });
});

describe("test storeBook", () => {
  it("should return parts of the book response", () => {
    const book = books[1];
    expect(utils.storeBook(book)).toEqual({
      bookId: 77,
      bookTitle: "Fat King Thin Dog",
      redSeqNo: undefined, //this is undefined the first time
      chapters: book.chapters
    });
  });

  it("should update 'redSeqNo'", () => {
    const book = books[1];
    const before = utils.storeBook(book);
    expect(before).toEqual({
      bookId: 77,
      bookTitle: "Fat King Thin Dog",
      redSeqNo: undefined, //this is undefined the first time
      chapters: book.chapters
    });

    // update which chapter who has been red
    book.seqNo = 1;

    expect(utils.storeBook(book)).toEqual({
      bookId: 77,
      bookTitle: "Fat King Thin Dog",
      redSeqNo: 1,
      chapters: book.chapters
    });
  });
});

describe("test formatBookResult", () => {
  it("should extract and format relevant values from book result", () => {
    const book = books[0];
    expect(utils.formatBookResult(book)).toEqual({
      id: book.id,
      title: book.title,
      description: book.description,
      readingLevel: book.readingLevel,
      image: new Image({
        url: book.coverImage.url,
        alt: book.title
      })
    });
  });
});

describe("test getFormattedBookResults", () => {
  it("should format list of books to a map with bookId as key", () => {
    const expected = {
      "397": utils.formatBookResult(books[0]),
      "77": utils.formatBookResult(books[1])
    };
    expect(utils.getFormattedBookResults(books)).toEqual(expected);
  });
});

describe("test formatBookTitles", () => {
  it("should return a string with 16 in it (totalCount)", () => {
    expect(utils.formatBookTitles("dog", null, 16, books)).toMatch("16");
  });

  it("should return a string with 'cat' as topic", () => {
    expect(utils.formatBookTitles("cat", "", 7, books)).toMatch("cat");
  });

  it("should return a string with 'one' as level", () => {
    expect(utils.formatBookTitles("", "one", 7, books)).toMatch("one");
  });

  it("should return a string with 'read aloud' as level", () => {
    expect(utils.formatBookTitles(null, "read aloud", 7, books)).toMatch(
      "read aloud"
    );
  });
});

describe("test isEmpty(object)", () => {
  it("should return true for empty object", () => {
    expect(utils.isEmpty({})).toBeTruthy();
  });

  it("should return false for object containing values", () => {
    expect(utils.isEmpty({ test: "test" })).toBeFalsy();
  });
});

describe("test transformReadingLevel(level)", () => {
  it("should return 1 for level 'one'", () => {
    expect(utils.transformReadingLevel("one")).toBe("1");
  });

  it("should return 4 for level '4'", () => {
    expect(utils.transformReadingLevel("4")).toBe("4");
  });

  it("should return 1 for level 'ONE'", () => {
    expect(utils.transformReadingLevel("ONE")).toBe("1");
  });

  it("should return 1 for level 'One'", () => {
    expect(utils.transformReadingLevel("One")).toBe("1");
  });

  it("should return 'read-aloud' for level 'read aloud'", () => {
    expect(utils.transformReadingLevel("read aloud")).toBe("read-aloud");
  });
});

describe("test addReadingPauseAfterText(text, timeInSeconds)", () => {
  it('should return a <speak /> with <break time="1s"/>', () => {
    expect(utils.addReadingPauseAfterText("test", 1)).toBe(
      '<speak><p><s>test<break time="1s"/></s></p></speak>'
    );
  });
  it('should return a <speak /> with <break time="5s"/>', () => {
    expect(utils.addReadingPauseAfterText("test", 5)).toBe(
      '<speak><p><s>test<break time="5s"/></s></p></speak>'
    );
  });
});
