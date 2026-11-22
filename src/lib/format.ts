/** Shared date formats, so every post surface prints dates the same way. */

const short = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const long = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export const formatDate = (date: Date) => short.format(date);
export const formatLongDate = (date: Date) => long.format(date);
