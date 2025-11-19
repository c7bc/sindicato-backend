import * as migration_20251119_154209 from './20251119_154209';
import * as migration_20251119_215535 from './20251119_215535';

export const migrations = [
  {
    up: migration_20251119_154209.up,
    down: migration_20251119_154209.down,
    name: '20251119_154209',
  },
  {
    up: migration_20251119_215535.up,
    down: migration_20251119_215535.down,
    name: '20251119_215535'
  },
];
