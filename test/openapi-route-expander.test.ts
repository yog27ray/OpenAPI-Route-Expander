import { resolveRefsInRoutes } from '../';
import { FileUtil } from '../src/util/file.util';

describe('resolveRefsInRoutes', () => {
  test('throw error when input path is not absolute', () => {
    expect(() => resolveRefsInRoutes('../example/input/openapi.yaml', '../out/openapi.yaml'))
      .toThrow(Error('Path must be absolutePath. "../example/input/openapi.yaml"'));
  });
  test('throw error when output path is not absolute', () => {
    expect(() => resolveRefsInRoutes(`${__dirname}/../example/input/openapi.yaml`, '../out/openapi.yaml'))
      .toThrow(Error('Path must be absolutePath. "../out/openapi.yaml"'));
  });
  test('throw error when input path does not exist', () => {
    expect(() => resolveRefsInRoutes(`${__dirname}/../example/input/openapi-1.yaml`, `${__dirname}/../out/openapi.yaml`))
      .toThrow(Error('Path doesn\'t exists. "/Users/yog27ray/projects/yog27ray/github/OpenAPI-RouteExpander/test/../example/input/openapi-1.yaml"'));
  });
  test('writes the output of the file.', () => {
    resolveRefsInRoutes(`${__dirname}/../example/input/openapi.yaml`, `${__dirname}/../out/openapi.yaml`);
    const originalContent = FileUtil.readFile(`${__dirname}/../example/output/openapi.yaml`);
    const generatedContent = FileUtil.readFile(`${__dirname}/../out/openapi.yaml`);
    expect(originalContent).toBe(generatedContent);
  });
});
