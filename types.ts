
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export const aspectRatios: { value: AspectRatio; label: string }[] = [
  { value: '1:1', label: 'Quadrado (1:1)' },
  { value: '16:9', label: 'Paisagem (16:9)' },
  { value: '9:16', label: 'Retrato (9:16)' },
  { value: '4:3', label: 'Clássico (4:3)' },
  { value: '3:4', label: 'Vertical (3:4)' },
];
