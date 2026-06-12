// 应用常量配置

export const APP_NAME = "grbk";
export const APP_DESCRIPTION = "一个简洁、克制的个人博客";
export const MAX_USERS = 10;
export const POSTS_PER_PAGE = 12;
export const SEARCH_POSTS_PER_PAGE = 20;

// 登录限流
export const LOGIN_RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 秒窗口
export const LOGIN_RATE_LIMIT_MAX_ATTEMPTS = 5; // 最多 5 次

// bcrypt
export const BCRYPT_SALT_ROUNDS = 12;

// Session
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 天
