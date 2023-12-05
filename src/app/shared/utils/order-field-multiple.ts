export function textField(values: string[], text: Record<string, any>) {
  let ans = [];
  for (const iterator of values) {
    ans.push(text[iterator]);
  }
  return ans;
}
