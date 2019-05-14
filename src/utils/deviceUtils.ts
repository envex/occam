import { PostData } from 'app';
import { HUNTSMAN_ELITE_MATRIX } from 'matrix/huntsman_elite';

const HUNTSMAN_ELITE = 'huntsman_elite';
const MAMBA_WIRELESS = 'mamba_wireless';
const GOLIATHUS = 'goliathus_chroma_extended';

export function getPostDataForDevice(device: string, hex: string): PostData {
  const data: PostData = {
    type: 'raw',
  };

  switch (device) {
    case HUNTSMAN_ELITE:
      const rows: string[][] = [];

      for (const row in HUNTSMAN_ELITE_MATRIX) {
        if (!row) {
          continue;
        }

        rows.push([]);

        for (const col in HUNTSMAN_ELITE_MATRIX[row]) {
          if (col) {
            rows[row].push(hex);
          }
        }
      }

      data.rows = rows;
      break;
    case MAMBA_WIRELESS:
      // Mouse only has 2 parts, wheel and logo
      data.parts = [hex, hex];
      break;
    case GOLIATHUS:
      // Pad only accepts 1 color for the entire matt
      data.parts = [hex];
      break;
    default:
      break;
  }

  return data;
}
