import { Strategy } from './strategy';
import { Context, SnakeDirection } from './context';

export class CustomStrategy implements Strategy {
    private steps = 0;
    private current = SnakeDirection.left;

    step(context: Context): SnakeDirection {
        const min = SnakeDirection.left;

        this.steps++;

        if (this.steps % 5 === 0) {
            this.current++;
            if (this.current > SnakeDirection.down) {
                this.current = SnakeDirection.left;
            }
        }

        return this.current;
    }
}
