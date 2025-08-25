import fs from 'fs';
import { Validation } from './validation';
import { FileUtil } from './util/file.util';
import {
  extractFileName,
  fixOpenApiAbsoluteRoute,
  fixOpenApiYamlStringIssue,
  fixTrailingSlash,
  mergeNestedPaths,
  replaceRelativeToAbsolutePath,
} from './openapi-json';
import { YAMLUtil } from './util/y-a-m-l.util';

export function resolveRefsInRoutes(inputFilePath: string, outputFilePath: string): void {
  Validation.absolutePaths([inputFilePath, outputFilePath]);
  Validation.pathExist(inputFilePath);
  FileUtil.createDirector(FileUtil.getDirectory(outputFilePath));
  let openApiJSON = FileUtil.readYaml(inputFilePath);
  const fileName = extractFileName(inputFilePath);
  openApiJSON = replaceRelativeToAbsolutePath(openApiJSON, FileUtil.getDirectory(inputFilePath), fileName);
  openApiJSON.paths = mergeNestedPaths(openApiJSON.paths as Record<string, unknown>, inputFilePath);
  openApiJSON.paths = fixTrailingSlash(openApiJSON.paths as Record<string, unknown>);
  openApiJSON = fixOpenApiAbsoluteRoute(openApiJSON, FileUtil.getDirectory(outputFilePath));
  let openAPIYaml = YAMLUtil.stringify(openApiJSON);
  openAPIYaml = fixOpenApiYamlStringIssue(openAPIYaml);
  fs.writeFileSync(outputFilePath, openAPIYaml, 'utf-8');
}
