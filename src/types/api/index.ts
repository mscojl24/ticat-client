export * from './category';
export * from './festival';
export * from './interest';
export * from './myinfo';
export * from './stamp';

/** 2023/07/04 - 페이지 데이터 Type - by sineTlsl */
export interface PageInfoType {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
