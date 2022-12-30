export const croToEngString = (str: string) => {
  var translate_re = /[čćđšž]/g;
  var translate: Record<string, string> = {
    č: "c",
    ć: "c",
    đ: "d",
    š: "s",
    ž: "z",
  };
  return str.replace(translate_re, function (match: string) {
    return translate[match];
  });
};
