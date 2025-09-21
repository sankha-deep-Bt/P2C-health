import { CookieOptions, Response } from "express";
import { NODE_ENV } from "../constants/env";

export const ACCESS_TOKEN_NAME = "accessToken";
export const REFRESH_TOKEN_NAME = "refreshToken";

export const REFRESH_PATH = "/api/auth/refresh";

const secure = NODE_ENV !== "development";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: new Date(Date.now() + 15 * 60 * 1000),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  path: REFRESH_PATH,
});

type Params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) =>
  res
    .cookie(ACCESS_TOKEN_NAME, accessToken, getAccessTokenCookieOptions())
    .cookie(REFRESH_TOKEN_NAME, refreshToken, getRefreshTokenCookieOptions());

export const clearAuthCookies = (res: Response) =>
  res
    .clearCookie(ACCESS_TOKEN_NAME, getAccessTokenCookieOptions())
    .clearCookie(REFRESH_TOKEN_NAME, getRefreshTokenCookieOptions());
