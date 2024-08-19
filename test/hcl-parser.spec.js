import { expect, test } from 'vitest';
import {parse} from "hcl-parser";

const hcl = `
table "users" {
  schema = schema.public
  column "id" {
    type = int
  }
  column "name" {
    type = varchar(255)
  }
  column "manager_id" {
    type = int
  }
  primary_key {
    columns = [
      column.id
    ]
  }
  index "idx_name" {
    columns = [
      column.name
    ]
    unique = true
  }
  foreign_key "manager_fk" {
    columns = [column.manager_id]
    ref_columns = [column.id]
    on_delete = CASCADE
    on_update = NO_ACTION
  }
}`;

const hcl2 = `
  allow {
    user = "admin"
  }
 
  deny {
    user = "anonymous"
  }
`;

test('hcl parser test', () => {
    const [data, err] = parse(hcl);
    console.log(data, err);
});