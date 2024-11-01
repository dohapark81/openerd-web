/**
 * 컬럼
 */
export interface Column {
  /**
   * 물리적 이름
   */
  name: string;
  /**
   * 논리적 이름
   */
  logical_name?: string;
  /**
   * 기본 키 여부
   */
  primary_key: boolean;
  /**
   * 타입 (int, varchar, text, timestamp ...)
   */
  type: string;
  /**
   * 부호 없음 여부 (true: 부호 없음, false: 부호 있음)
   */
  unsigned?: boolean;
  /**
   * 자동 증가 여부
   */
  auto_increment?: boolean;
  /**
   * NULL 허용 여부
   */
  null: boolean;
  /**
   * 기본값
   */
  default?: string | boolean;
}

/**
 * 인덱스
 */
export interface Index {
  columns: string[];
  unique: boolean;
}

export interface Position {
  x: number;
  y: number;
}

/**
 * 테이블
 */
export interface Table {
  name: string;
  logical_name: string;
  schema: string | Schema;
  charset: string;
  collate: string;
  columns: Column[];
  primary_key?: {
    columns: string[];
  };
  foreign_key?: {
    columns: string[];
  };
  index: {
    [key: string]: Index;
  };
  engine: string;
  comment?: string;
  position: Position;
}

/**
 * 스키마
 */
export interface Schema {
  /**
   * 문자셋
   */
  charset?: string;
  /**
   * 콜레이션
   */
  collate?: string;
  /**
   * 설명
   */
  comment?: string;
}

/**
 * 문서
 */
export interface Document {
  schema: {
    [key: string]: Schema;
  };
  table: {
    [key: string]: Table;
  };
}