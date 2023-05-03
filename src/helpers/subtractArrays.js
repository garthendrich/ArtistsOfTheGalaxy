export default function subtractArrays(a, b) {
  return a.map((value, index) => value + b[index]);
}
