export const isSingular = (count) => parseInt(count, 10) === 1;

export default {
  locale: () => "pl-PL",
  actions: {
    edit: () => "Edytuj",
    delete: () => "Usuń",
    reset: () => "Reset Kolumn",
  },
  actionPopover: {
    ariaLabel: () => "akcje",
  },
  actionToolbar: {
    selected: () => "WybranO",
  },
  batchSelection: {
    selected: (count) => `${count} wybrano`,
  },
  confirm: {
    no: () => "Nie",
    yes: () => "Tak",
  },
  errors: {
    messages: {
      formSummary:
        /* istanbul ignore next */
        (errors, warnings, type) => {
          const errorPlural = isSingular(errors) ? "błąd" : "błędy";
          const warningPlural = isSingular(warnings) ? "uwaga" : "uwagi";
          const isErrorPlural = isSingular(errors) ? "jest" : "są";
          const isWarningPlural = isSingular(warnings) ? "jest" : "są";

          if (errors && warnings && type === "warnings") {
            return `oraz ${warnings} ${warningPlural}`;
          }
          if (errors) {
            return `Tu ${isErrorPlural} ${errors} ${errorPlural}`;
          }
          if (warnings) {
            return `Tu ${isWarningPlural} ${warnings} ${warningPlural}`;
          }
          return null;
        },
    },
  },
  message: {
    closeButtonAriaLabel: () => "Zamknij",
  },
  numeralDate: {
    validation: {
      day: () => "Dzień musi być liczbą w zakresie 1-31.",
      month: () => "Miesiąć musi być liczbą w zakresie 1-12.",
      year: () => "Rok musi być liczbą w zakresie 1800-2200.",
    },
  },
  pager: {
    show: () => "Pokaz",
    records: (count, showNumber = true) => {
      const noun = isSingular(count) ? "rzecz" : "rzeczy";
      return showNumber ? `${count} ${noun}` : noun;
    },
    first: () => "Pierwsza",
    last: () => "Ostatnia",
    next: () => "Następna",
    previous: () => "Poprzednia",
    pageX: () => "Strona",
    ofY: (count) => `z ${count}`,
  },
  select: {
    actionButtonText: () => "Dodaj nowy element",
    placeholder: () => "Proszę wybierz...",
    noResultsForTerm: (term) => `Brak wyników "${term}"`,
  },
  switch: {
    on: () => "WŁ",
    off: () => "WYŁ",
  },
  table: {
    noData: () => "Brak wyników",
  },
  tileSelect: {
    deselect: () => "Odznacz",
  },
  wizards: {
    multiStep: {
      buttons: {
        submit: () => "Wyślij",
        next: () => "Następny",
        back: () => "Wstecz",
      },
    },
  },
};
