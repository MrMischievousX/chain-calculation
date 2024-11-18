export interface Func {
  id: number;
  expression: string;
  nextId: number | null;
  position: { x: number; y: number };
}
