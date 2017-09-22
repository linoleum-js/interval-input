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

export function itemsToPixels(
  items: Array<IntervalInputDataItem>,
  unitSize: number): Array<IntervalInputDataItem> {

  return items.map((item: IntervalInputDataItem): IntervalInputDataItem => {
    return itemToPixels(item, unitSize);
  });
}
