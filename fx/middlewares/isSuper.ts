import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types/MyContext";
import jwt from "jsonwebtoken";
import config from "../config";
import bcrypt from "bcryptjs";

interface Token {
  key: string;
}

export const isSuper: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const token = context.req.headers["super"] as string;

  try {
    const valid = jwt.verify(token, config.superKey) as Token;
    await bcrypt.compare(config.superPass, valid.key);

    return next();
  } catch (error) {
    throw new Error("Not authorized");
  }
};

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIkMmEkMTAkMWlUVGtaTEpYMEk3S0duajhVYzhaT1FMalpHRWNJSGdXLjFTd3g5OC95eUtJM2RZVEpXY08iLCJpYXQiOjE1NzUzOTQ2MDB9.1RDm0hg_CgONVBtgas8rmbhwCOQD63_j_j9FR8fl7wc
