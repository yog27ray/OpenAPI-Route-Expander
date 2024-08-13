import fs from 'fs';
import { FileUtil } from './util/file.util';
import path from 'path';

export function replaceRelativeToAbsolutePath<T extends Record<string, unknown>>(json: T, basePath: string): T {
  if (json instanceof Array) {
    return json.map((each) => replaceRelativeToAbsolutePath(each, basePath)) as unknown as T;
  }
  if (typeof json !== 'object') {
    return json;
  }
  return Object.keys(json).reduce((result: T, key: string): T => {
    if (key === '$ref' && json[key][0] === '.') {
      return { ...result, [key]: `${basePath}/${json[key] as string}` };
    }
    if (typeof json[key] === 'object') {
      return { ...result, [key]: replaceRelativeToAbsolutePath(json[key] as Record<string, unknown>, basePath) };
    }
    return result;
  }, json);
}

function extractSubPath<T extends Record<string, unknown>>(json: T, paths: Array<string>): T {
  if (!paths.length) {
    return json;
  }
  const path = paths.shift();
  return extractSubPath(path === '' ? json : json[path] as T, paths);
}

export function mergeNestedPaths<T extends Record<string, unknown>>(paths: T, filePath: string, pathPrefix: string = ''): T {
  const filePathSplit = filePath.split('/');
  const currentFolder = filePathSplit.slice(0, filePathSplit.length - 1).join('/');
  return Object.keys(paths).reduce((result, key) => {
    if (['get', 'post', 'put', 'delete'].includes(key)) {
      return {
        ...result,
        [pathPrefix]: {
          ...(result[pathPrefix] || {}),
          [key]: replaceRelativeToAbsolutePath(paths[key] as T, currentFolder),
        },
      };
    }
    if (key === '$ref') {
      const [nextYamlFileRelativePath, nextYamlSubPath = '/'] = (paths[key] as string).split('#');
      const nextYamlFileAbsolutePath = nextYamlFileRelativePath[0] === '/'
        ? nextYamlFileRelativePath
        : `${currentFolder}/${nextYamlFileRelativePath}`;
      const nextYamlJSON = FileUtil.readYaml(nextYamlFileAbsolutePath);
      const nextYamlSubPaths = nextYamlSubPath.split('/');
      const nextPaths = extractSubPath(nextYamlJSON, nextYamlSubPaths);
      const mergedPaths = mergeNestedPaths(nextPaths, nextYamlFileAbsolutePath, pathPrefix);
      return { ...result, ...mergedPaths };
    }
    const newPathPrefix = `${pathPrefix}${key}`.replace(/\/\//g, '/');
    const mergedPaths = mergeNestedPaths(paths[key] as T, filePath, newPathPrefix);
    return { ...result, ...mergedPaths };
  }, {}) as T;
}

export function fixOpenApiAbsoluteRoute<T extends Record<string, unknown>>(json: T, basePath: string): T {
  if (json instanceof Array) {
    return json.map((each) => fixOpenApiAbsoluteRoute(each, basePath)) as unknown as T;
  }
  if (typeof json !== 'object') {
    return json;
  }
  return Object.keys(json).reduce((result, key: string) => {
    if (key === '$ref' && json[key][0] === '/') {
      const [filePath, componentReference] = (json[key] as string).split('#');
      return { ...result, [key]: `${path.relative(basePath, filePath)}${componentReference ? `#${componentReference}` : ''}` };
    }
    if (typeof json[key] === 'object') {
      return { ...result, [key]: fixOpenApiAbsoluteRoute(json[key] as Record<string, unknown>, basePath) };
    }
    return result;
  }, json);
}

export function fixOpenApiYamlStringIssue(yaml: string): string {
  return yaml.split('\n').map((each) => {
    if (each.includes('$ref')) {
      return `${each.replace('$ref: ', '$ref: "')}"`;
    }
    return each;
  }).join('\n');
}
