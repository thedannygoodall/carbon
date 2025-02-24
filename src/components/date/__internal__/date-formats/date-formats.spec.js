import getFormatData from ".";

const euLocales = ["en-GB", "en-ZA", "fr-FR", "es", "fr-CA", "de"];
const naLocales = ["en-US", "en-CA"];

const euFormats = [
  "d M yyyy",
  "dMyyyy",
  "d.M.yyyy",
  "d,M,yyyy",
  "d-M-yyyy",
  "d/M/yyyy",
  "d:M:yyyy",
  "dd M yyyy",
  "ddMyyyy",
  "dd.M.yyyy",
  "dd,M,yyyy",
  "dd-M-yyyy",
  "dd/M/yyyy",
  "dd:M:yyyy",
  "d MM yyyy",
  "dMMyyyy",
  "d.MM.yyyy",
  "d,MM,yyyy",
  "d-MM-yyyy",
  "d/MM/yyyy",
  "d:MM:yyyy",
  "dd MM yyyy",
  "ddMMyyyy",
  "dd.MM.yyyy",
  "dd,MM,yyyy",
  "dd-MM-yyyy",
  "dd/MM/yyyy",
  "dd:MM:yyyy",
  "d M yy",
  "dMyy",
  "d.M.yy",
  "d,M,yy",
  "d-M-yy",
  "d/M/yy",
  "d:M:yy",
  "dd M yy",
  "ddMyy",
  "dd.M.yy",
  "dd,M,yy",
  "dd-M-yy",
  "dd/M/yy",
  "dd:M:yy",
  "d MM yy",
  "dMMyy",
  "d.MM.yy",
  "d,MM,yy",
  "d-MM-yy",
  "d/MM/yy",
  "d:MM:yy",
  "dd MM yy",
  "ddMMyy",
  "dd.MM.yy",
  "dd,MM,yy",
  "dd-MM-yy",
  "dd/MM/yy",
  "dd:MM:yy",
  "d",
  "d M",
  "dM",
  "d.M",
  "d,M",
  "d-M",
  "d/M",
  "d:M",
  "dd",
  "d MM",
  "dMM",
  "d.MM",
  "d,MM",
  "d-MM",
  "d/MM",
  "d:MM",
  "dd M",
  "ddM",
  "dd.M",
  "dd,M",
  "dd-M",
  "dd/M",
  "dd:M",
  "dd MM",
  "ddMM",
  "dd.MM",
  "dd,MM",
  "dd-MM",
  "dd/MM",
  "dd:MM",
];

const naFormats = [
  "M",
  "M d",
  "Md",
  "M.d",
  "M,d",
  "M-d",
  "M/d",
  "M:d",
  "MM",
  "M dd",
  "Mdd",
  "M.dd",
  "M,dd",
  "M-dd",
  "M/dd",
  "M:dd",
  "MM d",
  "MMd",
  "MM.d",
  "MM,d",
  "MM-d",
  "MM/d",
  "MM:d",
  "MM dd",
  "MMdd",
  "MM.dd",
  "MM,dd",
  "MM-dd",
  "MM/dd",
  "MM:dd",
  "M d yy",
  "Mdyy",
  "M.d.yy",
  "M,d,yy",
  "M-d-yy",
  "M/d/yy",
  "M:d:yy",
  "MM d yy",
  "MMdyy",
  "MM.d.yy",
  "MM,d,yy",
  "MM-d-yy",
  "MM/d/yy",
  "MM:d:yy",
  "M dd yy",
  "Mddyy",
  "M.dd.yy",
  "M,dd,yy",
  "M-dd-yy",
  "M/dd/yy",
  "M:dd:yy",
  "MM dd yy",
  "MMddyy",
  "MM.dd.yy",
  "MM,dd,yy",
  "MM-dd-yy",
  "MM/dd/yy",
  "MM:dd:yy",
  "M d yyyy",
  "Mdyyyy",
  "M.d.yyyy",
  "M,d,yyyy",
  "M-d-yyyy",
  "M/d/yyyy",
  "M:d:yyyy",
  "MM d yyyy",
  "MMdyyyy",
  "MM.d.yyyy",
  "MM,d,yyyy",
  "MM-d-yyyy",
  "MM/d/yyyy",
  "MM:d:yyyy",
  "M dd yyyy",
  "Mddyyyy",
  "M.dd.yyyy",
  "M,dd,yyyy",
  "M-dd-yyyy",
  "M/dd/yyyy",
  "M:dd:yyyy",
  "MM dd yyyy",
  "MMddyyyy",
  "MM.dd.yyyy",
  "MM,dd,yyyy",
  "MM-dd-yyyy",
  "MM/dd/yyyy",
  "MM:dd:yyyy",
];

const formatMap = [...euLocales, ...naLocales].reduce((acc, code) => {
  if (code === "de") {
    return {
      ...acc,
      [code]: "dd.MM.yyyy",
    };
  }

  if (["en-CA", "en-US"].includes(code)) {
    return {
      ...acc,
      [code]: "MM/dd/yyyy",
    };
  }

  return {
    ...acc,
    [code]: "dd/MM/yyyy",
  };
}, {});

describe.each([...euLocales, ...naLocales])(
  "getFormatData for `%s` returns",
  (locale) => {
    const { formats, format } = getFormatData({ code: locale });

    it("the expected formats", () => {
      const expectedFormats = naLocales.includes(locale)
        ? naFormats
        : euFormats;

      expect(
        expectedFormats.every((formatStr) => formats.includes(formatStr)) &&
          formats.length === expectedFormats.length
      ).toEqual(true);
    });

    it("the expected format", () => {
      expect(format).toEqual(formatMap[locale]);
    });
  }
);
