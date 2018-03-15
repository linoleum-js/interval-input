const uuid = require('uuid');

import IntervalInputDataItem from '../interfaces/IntervalInputDataItem';
import IntervalInputData from '../interfaces/IntervalInputData';

import types from './types';

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
    id: item.id,
    type: item.type,
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

export function createItem(type: string, start: number, end: number):IntervalInputDataItem {
  return {
    type,
    start,
    end,
    id: uuid()
  }
}

export function createEmpty(start: number, end: number):IntervalInputDataItem {
  return createItem('empty', start, end);
}

export function supressEvent(event: any) {
  event.stopPropagation();
  event.nativeEvent.stopImmediatePropagation();
  event.preventDefault();
  event.nativeEvent.preventDefault();
}

export function getTypeForNew(type: string): string {
  const typeNames = Object.keys(types);
  return type === typeNames[0] ? typeNames[1] : typeNames[0];
}

export function keepOnScreen(position: any, size: number): any {
  const doc = document.documentElement;
  const overflowX = position.left + size - doc.clientWidth;
  const overflowY = position.top + size - doc.clientHeight;
  const result = {...position};
  if (overflowX > 0) {
    result.left -= overflowX + 5;
  }
  if (overflowY > 0) {
    result.top -= overflowY + 5;
  }
  return result;
}

export function addDocumentClass(className: string) {
  document.documentElement.classList.add(className);
}

export function removeDocumentClass(className: string) {
  document.documentElement.classList.remove(className);
}

export function fillWithEmptyItems(data: IntervalInputData, max: number): IntervalInputData {
  const result: Array<IntervalInputDataItem> = [];
  const list = data.intervals;
  let prevEnd = 0;
  if (!list.length) {
    return {
      intervals: [createEmpty(0, max)]
    };
  }
  list.forEach((item: IntervalInputDataItem, index: number) => {
    if (item.start > prevEnd) {
      result.push(createEmpty(prevEnd, item.start));
    }
    prevEnd = item.end;
    result.push(item);
  });
  const lastItem = list[list.length - 1];
  if (lastItem.end < max) {
    result.push(createEmpty(lastItem.end, max));
  }
  return {
    intervals: result,
    id: data.id
  };
}
