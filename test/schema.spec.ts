import { expect, test } from 'vitest';
import {Schema, Table, Document} from "../src/types/schema";

const schema: Schema = {
  charset: "utf8mb4",
  collate: "utf8mb4_unicode_ci",
  comment: "Stores user account information"
};

const usersTable: Table = {
  schema: 'userdb',
  name: 'users',
  logical_name: 'Users',
  charset: "utf8mb4",
  collate: "utf8mb4_unicode_ci",
  columns: [
    {
      name: "id",
      type: "bigint",
      unsigned: true,
      auto_increment: true,
      null: false
    },
    {
      name: "username",
      type: "varchar(50)",
      null: false
    },
    {
      name: "email",
      type: "varchar(255)",
      null: false
    },
    {
      name: "password_hash",
      type: "varchar(255)",
      null: false
    },
    {
      name: "first_name",
      type: "varchar(50)",
      null: true
    },
    {
      name: "last_name",
      type: "varchar(50)",
      null: true
    },
    {
      name: "date_of_birth",
      type: "date",
      null: true
    },
    {
      name: "created_at",
      type: "timestamp",
      default: "CURRENT_TIMESTAMP",
      null: false
    },
    {
      name: "updated_at",
      type: "timestamp",
      default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
      null: false
    },
    {
      name: "last_login",
      type: "timestamp",
      null: true
    },
    {
      name: "is_active",
      type: "boolean",
      default: true,
      null: false
    }
  ],
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