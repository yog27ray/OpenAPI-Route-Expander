import YAML from 'yaml';

export class YAMLUtil {
  static parse(fileContent: string): Record<string, unknown> {
    return YAML.parse(fileContent) as Record<string, unknown>;
  }

  static stringify(yaml: Record<string, unknown>): string {
    return YAML.stringify(yaml);
  }
}
