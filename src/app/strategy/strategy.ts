import { Context, SnakeDirection } from './context';

export abstract class Strategy {
    abstract step(context: Context): SnakeDirection;
}
