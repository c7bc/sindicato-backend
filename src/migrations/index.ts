import * as migration_20251119_154209 from './20251119_154209';
import * as migration_20251119_215535 from './20251119_215535';
import * as migration_20251119_220700_team_sections from './20251119_220700_team_sections';
import * as migration_20251119_221000_nav_item_button from './20251119_221000_nav_item_button';
import * as migration_20251120_000300_assinatura_digital_text from './20251120_000300_assinatura_digital_text';
import * as migration_20260416_120000_carousel_slides from './20260416_120000_carousel_slides';
import * as migration_20260418_100000_sindicalize_uploads from './20260418_100000_sindicalize_uploads';
import * as migration_20260418_110000_acts_ccts from './20260418_110000_acts_ccts';
import * as migration_20260420_120000_denuncias from './20260420_120000_denuncias';
import * as migration_20260423_210000_fix_locked_docs_rels from './20260423_210000_fix_locked_docs_rels';
import * as migration_20260426_010000_media_prefix from './20260426_010000_media_prefix';

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
  {
    up: migration_20260416_120000_carousel_slides.up,
    down: migration_20260416_120000_carousel_slides.down,
    name: '20260416_120000_carousel_slides',
  },
  {
    up: migration_20260418_100000_sindicalize_uploads.up,
    down: migration_20260418_100000_sindicalize_uploads.down,
    name: '20260418_100000_sindicalize_uploads',
  },
  {
    up: migration_20260418_110000_acts_ccts.up,
    down: migration_20260418_110000_acts_ccts.down,
    name: '20260418_110000_acts_ccts',
  },
  {
    up: migration_20260420_120000_denuncias.up,
    down: migration_20260420_120000_denuncias.down,
    name: '20260420_120000_denuncias',
  },
  {
    up: migration_20260423_210000_fix_locked_docs_rels.up,
    down: migration_20260423_210000_fix_locked_docs_rels.down,
    name: '20260423_210000_fix_locked_docs_rels',
  },
  {
    up: migration_20260426_010000_media_prefix.up,
    down: migration_20260426_010000_media_prefix.down,
    name: '20260426_010000_media_prefix',
  },
];
