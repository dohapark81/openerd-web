import { expect, test } from 'vitest';
import {parse} from "hcl-parser";

const hcl = `
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