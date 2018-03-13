import IntervalInputDataItem from '../interfaces/IntervalInputDataItem';

export function unitsToPixels(units: number, unitSize: number): number {
  return units * unitSize;
};

export function pixelsToUnits(pixels: number, unitSize: number): number {
  return pixels / unitSize;
}

export function itemToPixels(
  item: IntervalInputDataItem,
  unitSize: number): IntervalInputDataItem {

  return {
    ...item,
    start: unitsToPixels(item.start, unitSize),
    end: unitsToPixels(item.end, unitSize)
  };
}

export function itemToUnits(
  item: IntervalInputDataItem,
  unitSize: number): IntervalInputDataItem {

  return {
    ...item,
    start: pixelsToUnits(item.start, unitSize),
    end: pixelsToUnits(item.end, unitSize)
  };
}

export function hasParent(node: any, parent: any) {
  while(node) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

export function roundTo(number: number, divider: number): number {
  const n = Math.floor(number / divider);
  const r = number % divider;
  return n * divider + (r >= divider / 2 ? divider : 0);
  // return Math.floor(number * divider) / divider;
}

export function padWithZero(number: number): string {
  return (number < 10 ? '0': '') + number;
}

export function secToHHMM(seconds: number): string {
  seconds = Math.round(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return padWithZero(hours) + ':' + padWithZero(minutes);
}

export function isEmpty(data: any): boolean {
  if (typeof data === 'string') {
    return data === 'empty';
  } else {
    return data.type === 'empty';
  }
}
