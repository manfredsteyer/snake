import { Strategy } from './strategy';
import { Context, SnakeDirection } from './context';

export class CustomStrategy implements Strategy {
    private steps = 0;
    private current = SnakeDirection.left;

    step(context: Context): SnakeDirection {
        const min = SnakeDirection.left;

        this.steps++;

        if (this.steps % 10 === 0) {
            const newDirection = Math.floor(Math.random() * 1000) % 4 + min;

            if (Math.abs(newDirection - this.current) !== 2) {
                this.current = newDirection;
            }
        }

        return this.current;
    }
}
