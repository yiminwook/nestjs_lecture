import { join } from 'path';

export const PROJECT_ROOT_PATH = process.cwd();
export const PUBLIC_FOLDER_NAME = 'public';
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);
export const POSTS_FOLDER_NAME = 'posts';
export const POSTS_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, POSTS_FOLDER_NAME);
export const TEMO_FOLDER_NAME = 'temp';
export const TEMP_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, TEMO_FOLDER_NAME);
