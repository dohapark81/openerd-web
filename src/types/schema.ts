  export interface Column {
    type: string;
    unsigned?: boolean;
    auto_increment?: boolean;
    null: boolean;
    default?: string | boolean;
  }
  
  export interface Index {
    columns: string[];
    unique: boolean;
  }
  
  export interface Table {
    name: string;
    schema: Schema;
    charset: string;
    collate: string;
    columns: {
      [key: string]: Column;
    };
    primaryKeys?: {
      columns: string[];
    };
    foreignKeys?: {
      columns: string[];
    };
    indexes: {
      [key: string]: Index;
    };
    engine: string;
    comment?: string;
  }
  
  export interface Schema {
    name: string;
    charset: string;
    collate: string;
    comment: string;
  }