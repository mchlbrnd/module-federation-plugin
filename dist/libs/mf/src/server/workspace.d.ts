export declare type ProjectType = 'application' | 'library';
export interface NxOrCliWorkspaceDef {
    projects: {
        [name: string]: Project | string;
    };
}
export interface WorkspaceDef {
    projects: {
        [name: string]: Project;
    };
}
export interface Project {
    projectType: ProjectType;
    sourceRoot: string;
    architect: {
        [key: string]: Target;
    };
}
export interface Target {
    options: {
        port?: number;
        outputPath?: string;
    };
}
export interface ProjectInfo {
    name: string;
    projectType: ProjectType;
    sourceRoot: string;
    port?: number;
    outputPath?: string;
}
export declare function isWorkspace(): boolean;
export declare function readWorkspaceDef(): WorkspaceDef;
export declare function readProjectInfos(): ProjectInfo[];
