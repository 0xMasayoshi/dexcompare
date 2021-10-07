export function psRatio(marketCap, totalRevenue) {
  return marketCap / totalRevenue;
}

export function peRatio(marketCap, protocolRevenue) {
  return marketCap / protocolRevenue;
}

export function capitalEfficiency(volume, tvl) {
  return volume / tvl;
}

export function spread(volume, revenue) {
  return volume / revenue;
}

export function marketShare(revenue, totalRevenue) {
  return revenue / totalRevenue;
}

export function volumePerCustomer(volume, users) {
  return volume / users;
}

export function averageReturnPerUser(revenue, users) {
  return revenue / users;
}

export function inflationRate(
  currentTotalSupply,
  pastTotalSupply,
  pastCirculatingSupply
) {
  return (currentTotalSupply - pastTotalSupply) / pastCirculatingSupply;
}

export function marketCap(price, supply) {
  return price * supply;
}

export function percentChange(newValue, oldValue) {
  return (newValue - oldValue) / oldValue;
}
