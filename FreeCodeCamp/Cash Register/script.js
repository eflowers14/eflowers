let price = 19.5;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.10],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];
let cua = [
  ['PENNY', 0.01],
  ['NICKEL', 0.05],
  ['DIME', 0.10],
  ['QUARTER', 0.25],
  ['ONE', 1.00],
  ['FIVE', 5.00],
  ['TEN', 10.00],
  ['TWENTY', 20.00],
  ['ONE HUNDRED', 100.00]
];

// HTML
const priceText = document.getElementById('price');
const cashInDrawer = document.getElementById('cid');
const cash = document.getElementById('cash');
const purchaseBtn = document.getElementById('purchase-btn');
const change = document.getElementById('change-due');

priceText.innerText = price;

// Mapa de valores
const coinValueMap = {};
cua.forEach(item => { coinValueMap[item[0]] = item[1]; });

// Helpers
const getDrawerTotal = () =>
  parseFloat(cid.reduce((sum, [,amt]) => sum + amt, 0).toFixed(2));

// Mostrar total inicial (solo informativo)
cashInDrawer.innerText = getDrawerTotal().toFixed(2);

// Formateadores
const formatDescFromCid = (pairs) =>
  pairs
    .slice().reverse()                // cid viene de menor->mayor; lo invierto
    .filter(([, amt]) => amt > 0)     // solo montos > 0
    .map(([name, amt]) => `${name}: $${amt}`)
    .join(", ");

const formatFromChangeArray = (pairs) =>
  pairs
    .filter(([, amt]) => amt > 0)     // ya viene mayor->menor por como lo armamos
    .map(([name, amt]) => `${name}: $${amt}`)
    .join(", ");

// Calcula el cambio sin mutar cid
function getChangeArray(changeDue) {
  let changeArray = [];
  for (let i = cid.length - 1; i >= 0; i--) {
    const coinName = cid[i][0];
    let coinTotal = cid[i][1];
    const coinValue = coinValueMap[coinName];
    let amountToReturn = 0;

    while (changeDue >= coinValue && coinTotal > 0) {
      changeDue = parseFloat((changeDue - coinValue).toFixed(2));
      coinTotal = parseFloat((coinTotal - coinValue).toFixed(2));
      amountToReturn = parseFloat((amountToReturn + coinValue).toFixed(2));
    }
    if (amountToReturn > 0) changeArray.push([coinName, amountToReturn]);
  }
  if (changeDue > 0) return []; // no se pudo dar cambio exacto
  return changeArray;
}

// Evento click
purchaseBtn.addEventListener('click', () => {
  const cashValue = parseFloat(cash.value);
  const changeDue = parseFloat((cashValue - price).toFixed(2));
  const total = getDrawerTotal(); // <<< recomputar SIEMPRE aquí

  if (cashValue < price) {
    alert("Customer does not have enough money to purchase the item");
  } else if (cashValue === price) {
    change.innerText = "No change due - customer paid with exact cash";
  } else {
    if (total < changeDue) {
      change.innerText = "Status: INSUFFICIENT_FUNDS";
    } else if (total === changeDue) {
      // CLOSED: se devuelve TODO el cajón, mayor->menor, sin ceros
      change.innerText = `Status: CLOSED ${formatDescFromCid(cid)}`;
    } else {
      const changeArray = getChangeArray(changeDue);
      if (changeArray.length === 0) {
        change.innerText = "Status: INSUFFICIENT_FUNDS";
      } else {
        change.innerText = `Status: OPEN ${formatFromChangeArray(changeArray)}`;
      }
    }
  }

  // Solo UI: refrescar total mostrado (no tocamos cid aquí)
  cashInDrawer.innerText = getDrawerTotal().toFixed(2);
});
