import "@testing-library/jest-dom";
import "reflect-metadata";
import { TextEncoder, TextDecoder } from "util";
import { Request, Response } from "node-fetch";

global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
global.Request = Request as unknown as typeof global.Request;
global.Response = Response as unknown as typeof global.Response;
