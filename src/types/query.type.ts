export type WithPagination = {
  pagination: {
    totalCount: number;
    currentPage: number;
    limit: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
};

export type WithCursorPagination = {
  nextCursor: string | null;
};
