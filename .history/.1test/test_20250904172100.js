const click = document.getElementById('click')
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

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
