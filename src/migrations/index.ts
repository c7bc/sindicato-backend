import * as migration_20251119_154209 from './20251119_154209';
import * as migration_20251119_215535 from './20251119_215535';
import * as migration_20251119_220700_team_sections from './20251119_220700_team_sections';
import * as migration_20251119_221000_nav_item_button from './20251119_221000_nav_item_button';
import * as migration_20251120_000300_assinatura_digital_text from './20251120_000300_assinatura_digital_text';

export const migrations = [
  {
    up: migration_20251119_154209.up,
    down: migration_20251119_154209.down,
    name: '20251119_154209',
  },
  {
    up: migration_20251119_215535.up,
    down: migration_20251119_215535.down,
    name: '20251119_215535',
  },
  {
    up: migration_20251119_220700_team_sections.up,
    down: migration_20251119_220700_team_sections.down,
    name: '20251119_220700_team_sections',
  },
  {
    up: migration_20251119_221000_nav_item_button.up,
    down: migration_20251119_221000_nav_item_button.down,
    name: '20251119_221000_nav_item_button',
  },
  {
    up: migration_20251120_000300_assinatura_digital_text.up,
    down: migration_20251120_000300_assinatura_digital_text.down,
    name: '20251120_000300_assinatura_digital_text',
  },
];
