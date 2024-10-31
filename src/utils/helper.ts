function formatCurrency(amount) {
  const formattedAmount = amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return formattedAmount;
}

export { formatCurrency };

export default function flattenArray<T>(list: T[], key = 'children'): T[] {
  let children: T[] = [];

  const flatten = list?.map((item: any) => {
    if (item[key] && item[key].length) {
      children = [...children, ...item[key]];
    }
    return item;
  });

  return flatten?.concat(children.length ? flattenArray(children, key) : children);
}
