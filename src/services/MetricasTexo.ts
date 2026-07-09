function jaroWinkler(a :string, b: string) {
  if (a === b) return 1;

  const tamanhoA = a.length;
  const tamanhoB = b.length;
  if (tamanhoA === 0 || tamanhoB === 0) return 0;

  const distanciaMax = Math.floor(Math.max(tamanhoA, tamanhoB) / 2) - 1;
  const correspondeA = new Array(tamanhoA).fill(false);
  const correspondeB = new Array(tamanhoB).fill(false);

  let correspondencias = 0;
  for (let i = 0; i < tamanhoA; i++) {
    const inicio = Math.max(0, i - distanciaMax);
    const fim = Math.min(i + distanciaMax + 1, tamanhoB);
    for (let j = inicio; j < fim; j++) {
      if (correspondeB[j] || a[i] !== b[j]) continue;
      correspondeA[i] = true;
      correspondeB[j] = true;
      correspondencias++;
      break;
    }
  }

  if (correspondencias === 0) return 0;

  let transposicoes = 0;
  let k = 0;
  for (let i = 0; i < tamanhoA; i++) {
    if (!correspondeA[i]) continue;
    while (!correspondeB[k]) k++;
    if (a[i] !== b[k]) transposicoes++;
    k++;
  }
  transposicoes = transposicoes / 2;

  const jaro = (
    correspondencias / tamanhoA +
    correspondencias / tamanhoB +
    (correspondencias - transposicoes) / correspondencias
  ) / 3;

 
  let prefixo = 0;
  for (let i = 0; i < Math.min(4, tamanhoA, tamanhoB); i++) {
    if (a[i] === b[i]) prefixo++;
    else break;
  }

  return jaro + prefixo * 0.1 * (1 - jaro);
}

function levenshteinNormalizado(a, b) {
  const tamanhoA = a.length;
  const tamanhoB = b.length;
  if (tamanhoA === 0) return tamanhoB === 0 ? 1 : 0;
  if (tamanhoB === 0) return 0;

  const matriz = Array.from({ length: tamanhoA + 1 }, (_, i) =>
    new Array(tamanhoB + 1).fill(0).map((_, j) => (i === 0 ? j : 0))
  );
  for (let i = 0; i <= tamanhoA; i++) matriz[i][0] = i;

  for (let i = 1; i <= tamanhoA; i++) {
    for (let j = 1; j <= tamanhoB; j++) {
      const custo = a[i - 1] === b[j - 1] ? 0 : 1;
      matriz[i][j] = Math.min(
        matriz[i - 1][j] + 1,
        matriz[i][j - 1] + 1,
        matriz[i - 1][j - 1] + custo
      );
    }
  }

  const distancia = matriz[tamanhoA][tamanhoB];
  const tamanhoMax = Math.max(tamanhoA, tamanhoB);
  return 1 - distancia / tamanhoMax;
}


/*
console.log(jaroWinkler("mauro  romao", "mauro antonio romao"))
console.log(jaroWinkler("mauro ntonio romao", "mauro antonio romao"))
console.log(jaroWinkler("mauro antonio romao", "mauro antonio romao"))
*/


export {jaroWinkler, levenshteinNormalizado}