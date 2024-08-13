import { FileUtil } from './util/file.util';

export class Validation {
  private static absolutePath(path: string): void {
    if (FileUtil.isAbsolutePath(path)) {
      return;
    }
    throw Error(`Path must be absolutePath. "${path}"`);
  }

  private static pathExist(path: string): void {
    if (FileUtil.exists(path)) {
      return;
    }
    throw Error(`Path doesn't exists. "${path}"`);
  }

  static absolutePaths(paths: Array<string>): void {
    paths.forEach((path) => Validation.absolutePath(path));
  }

  static pathExists(paths: Array<string>): void {
    paths.forEach((path) => Validation.pathExist(path));
  }
}
