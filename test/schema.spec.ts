import { expect, test } from 'vitest';
import {Schema, Table, Document} from "../src/types/schema";

const schema: Schema = {
  charset: "utf8mb4",
  collate: "utf8mb4_unicode_ci",
  comment: "Stores user account information"
};

const usersTable: Table = {
  schema: 'userdb',
  charset: "utf8mb4",
  collate: "utf8mb4_unicode_ci",
  column: {
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
  primary_key: {
    columns: ["id"]
  },
  index: {
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

const document: Document = {
  schema: {
    userdb: schema,
    grafana: {}
  },
  table: {
    users: usersTable
  }
};

test('test', () => {
  console.log(document);
});