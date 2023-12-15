import { ElementRef } from '@angular/core';

export function validateHeight(
  wrapper: ElementRef<HTMLDivElement>,
  header: Element,
  footer: Element,
  tabViewHeightSet?
) {
  let availableHeight: number;
  availableHeight = wrapper.nativeElement.offsetHeight;
  availableHeight -= header ? header.scrollHeight : 0;
  availableHeight -= footer ? footer.scrollHeight + 24 : 0;
  const tabViewHeight = tabViewHeightSet ?? 60;
  const finalHeight = availableHeight - tabViewHeight;
  const minHeight = 300;
  const height = Math.max(finalHeight, minHeight);
  return `${height}px`;
}
