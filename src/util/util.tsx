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

export function hasParent(node: any, parent: any) {
  while(node) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
