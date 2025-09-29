function getChangeArray(changeDue) {
  const changeArray = [];
  for (let i = cid.length - 1; i >= 0; i--) {
    const coinName = cid[i][0];
    const coinValue = cid[i][1];
    const coinTotal = coinValue - (coinValue % 0.01);
    if (changeDue >= coinTotal) {
      changeArray.push([coinName, coinTotal]);
      changeDue -= coinTotal;
    }
  }
  console.log(changeArray);
  return changeArray;
}