import I18nProvider from "../../src/components/i18n-provider";
import plPL from "./pl-pl";

export default (Story) => (
  <I18nProvider locale={plPL}>
    <Story />
  </I18nProvider>
);
