import { OutputFile } from 'esbuild';
import { basename } from 'path';
import * as fs from 'fs';

export interface BuildResult {
  fileName: string;
  get(): Uint8Array | Buffer;
}

export class EsBuildResult implements BuildResult {
  public fileName: string;

  constructor(private outputFile: OutputFile) {
    this.fileName = outputFile.path;
  }

  get(): Uint8Array {
    return this.outputFile.contents;
  }
}

export interface NgCliAssetFile {
  source: string;
  destination: string;
}

export class NgCliAssetResult implements BuildResult {
  public get fileName(): string {
    return this.file.source;
  }

  private file: NgCliAssetFile;

  constructor(private assetFile: NgCliAssetFile) {
    this.file = assetFile;
  }

  get(): Buffer {
    return fs.readFileSync(this.file.source);
  }
}

export class MemResults {
  private map = new Map<string, BuildResult>();

  public add(result: BuildResult[]): void {
    for (const file of result) {
      this.map.set(basename(file.fileName), file);
    }
  }

  public get(fileName: string): BuildResult | undefined {
    return this.map.get(fileName);
  }

  public getFileNames(): string[] {
    return [...this.map.keys()];
  }
}
