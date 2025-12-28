export function roll(expr) {
  const [qtd, faces] = expr.split("d").map(Number);
  let total = 0;
  for (let i = 0; i < qtd; i++) {
    total += Math.floor(Math.random() * faces) + 1;
  }
  return total;
}