export enum SnakeDirection {
    left = 37,
    up = 38,
    right = 39,
    down = 40
}

export interface Position {
    x: number;
    y: number;
}

export interface Snake {
    direction: SnakeDirection;
    parts: Position[];
}

export interface Context {
    snake: Snake;
    fruit: Position;
    obstacles: Position[];
}

