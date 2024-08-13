import fs from 'fs';
import { YAMLUtil } from './y-a-m-l.util';

export class FileUtil {
  static isAbsolutePath(path: string): boolean {
    return path.startsWith('/');
  }

  static readFile(path: string): string {
    return fs.readFileSync(path, { encoding: 'utf-8', flag: 'r' });
  }

  static readYaml(path: string): Record<string, unknown> {
    return YAMLUtil.parse(FileUtil.readFile(path));
  }

  static getDirectory(path: string): string {
    const paths = path.split('/');
    paths.pop();
    return paths.join('/');
  }

  static exists(path: string): boolean {
    return fs.existsSync(path);
  }

  static createDirector(directory: string) {
    fs.mkdirSync(directory, { recursive: true });
  }
}
