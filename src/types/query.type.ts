export type WithPagination = {
  hasPrevious: boolean;
  hasNext: boolean;
};

export type WithCursorPagination = {
  nextCursor: string | null;
};
