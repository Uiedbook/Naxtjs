function benchSuit(code, runs = 1) {
  const st = Date.now();
  let i = 0;
  while (runs - i !== 0) {
    code();
    i++;
  }
  const time = Date.now() - st;
  console.log(
    "code took " +
      time +
      "  mini secs on " +
      runs +
      " runs and average of " +
      time / runs +
      " ms per operation"
  );
}

// benchSuit(() => {
//   let i = 0;
//   while (e.length - i !== 0) {
//     e[i] = null;
//     i++;
//   }
// }, 1000);
