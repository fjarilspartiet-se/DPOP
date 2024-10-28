// src/utils/format.ts

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};
