  /**
   * 컬럼
   */
  export interface Column {
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
  
  /**
   * 테이블
   */
  export interface Table {
    name: string;
    logical_name: string;
    schema: string | Schema;
    charset: string;
    collate: string;
    column: {
      [key: string]: Column;
    };
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