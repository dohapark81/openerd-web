import { expect, test } from 'vitest';
import {Schema, Table} from "../src/types/schema";

const schema: Schema = {
  name: "myapp",
  charset: "utf8mb4",
  collate: "utf8mb4_unicode_ci",
  comment: "Stores user account information"
};

const usersTable: Table = {
  schema: schema,
  name: "users",
  charset: "utf8mb4",
  collate: "utf8mb4_unicode_ci",
  columns: {
    id: {
      type: "bigint",
      unsigned: true,
      auto_increment: true,
      null: false
    },
    username: {
      type: "varchar(50)",
      null: false
    },
    email: {
      type: "varchar(255)",
      null: false
    },
    password_hash: {
      type: "varchar(255)",
      null: false
    },
    first_name: {
      type: "varchar(50)",
      null: true
    },
    last_name: {
      type: "varchar(50)",
      null: true
    },
    date_of_birth: {
      type: "date",
      null: true
    },
    created_at: {
      type: "timestamp",
      default: "CURRENT_TIMESTAMP",
      null: false
    },
    updated_at: {
      type: "timestamp",
      default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
      null: false
    },
    last_login: {
      type: "timestamp",
      null: true
    },
    is_active: {
      type: "boolean",
      default: true,
      null: false
    }
  },
  primaryKeys: {
    columns: ["id"]
  },
  indexes: {
    idx_username: {
      columns: ["username"],
      unique: true
    },
    idx_email: {
      columns: ["email"],
      unique: true
    }
  },
  engine: "InnoDB",
  comment: "Stores user account information"
};

test('test', () => {
    console.log(usersTable.columns)
});