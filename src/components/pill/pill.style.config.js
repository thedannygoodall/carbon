export default () => {
  return {
    status: {
      neutral: {
        varietyColor: "var(--colorsSemanticNeutral500)",
        buttonFocus: "var(--colorsSemanticNeutral600)",
        content: "var(--colorsSemanticNeutralYang100)",
      },
      negative: {
        varietyColor: "var(--colorsSemanticNegative500)",
        buttonFocus: "var(--colorsSemanticNegative600)",
        content: "var(--colorsSemanticNegativeYang100)",
      },
      warning: {
        varietyColor: "var(--colorsSemanticCaution400)",
        buttonFocus: "var(--colorsSemanticCaution600)",
        content: "var(--colorsSemanticCautionYin090)",
      },
      positive: {
        varietyColor: "var(--colorsSemanticPositive500)",
        buttonFocus: "var(--colorsSemanticPositive600)",
        content: "var(--colorsSemanticPositiveYang100)",
      },
    },
    tag: {
      primary: {
        varietyColor: "var(--colorsActionMajor500)",
        buttonFocus: "var(--colorsActionMajor600)",
        content: "var(--colorsActionMajorYang100)",
      },
    },
  };
};
