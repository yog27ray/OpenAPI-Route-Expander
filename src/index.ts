import fs from 'fs';
import { Validation } from './validation';
import { FileUtil } from './util/file.util';
import {
  fixOpenApiAbsoluteRoute,
  fixOpenApiYamlStringIssue,
  mergeNestedPaths,
  replaceRelativeToAbsolutePath,
} from './openapi-json';
import { YAMLUtil } from './util/y-a-m-l.util';

export function resolveRefsInRoutes(inputFilePath: string, outputFilePath: string): void {
  Validation.absolutePaths([inputFilePath, outputFilePath]);
  Validation.pathExists([inputFilePath]);
  FileUtil.createDirector(FileUtil.getDirectory(outputFilePath));
  let openApiJSON = FileUtil.readYaml(inputFilePath);
  openApiJSON = replaceRelativeToAbsolutePath(openApiJSON, FileUtil.getDirectory(inputFilePath));
  openApiJSON.paths = mergeNestedPaths(openApiJSON.paths as Record<string, unknown>, inputFilePath);
  openApiJSON = fixOpenApiAbsoluteRoute(openApiJSON, FileUtil.getDirectory(outputFilePath));
  let openAPIYaml = YAMLUtil.stringify(openApiJSON);
  openAPIYaml = fixOpenApiYamlStringIssue(openAPIYaml);
  fs.writeFileSync(outputFilePath, openAPIYaml, 'utf-8');
}
