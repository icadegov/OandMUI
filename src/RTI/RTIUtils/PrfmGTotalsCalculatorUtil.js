export const calculateTotals = (data) => {
  return data.reduce(
    (acc, r) => {
      acc.totalQpending += r.qpending || 0;
      acc.totalApp += r.totapp || 0;
      acc.totalToDispose += (r.qpending || 0) + (r.totapp || 0);
      acc.totalDispo += r.totdispo || 0;
      acc.totalPending += r.totPending || 0;
      acc.totalInfo += r.infor || 0;
      acc.totalRej6 += r.rej6 || 0;
      acc.totalRs1 += r.rs1 || 0;
      acc.totalRs2 += r.rs2 || 0;
      acc.totalRs3 += r.rs3 || 0;
      acc.totalRs4 += r.rs4 || 0;
      acc.totalRs5 += r.rs5 || 0;
      acc.totalRs6 += r.rs6 || 0;
      acc.totalRs7 += r.rs7 || 0;
      acc.totalRs8 += r.rs8 || 0;
      acc.totalRs9 += r.rs9 || 0;
      acc.totalRs10 += r.rs10 || 0;
      acc.totalRs11 += r.rs11 || 0;
      acc.totalRs12 += r.rs12 || 0;
      acc.totalRs13 += r.rs13 || 0;
      acc.totalRs15 += r.rs15 || 0;
      acc.totalAmount += r.amount || 0;
      return acc;
    },
    {
      totalQpending: 0,
      totalApp: 0,
      totalToDispose: 0,
      totalDispo: 0,
      totalPending: 0,
      totalInfo: 0,
      totalRej6: 0,
      totalRs1: 0,
      totalRs2: 0,
      totalRs3: 0,
      totalRs4: 0,
      totalRs5: 0,
      totalRs6: 0,
      totalRs7: 0,
      totalRs8: 0,
      totalRs9: 0,
      totalRs10: 0,
      totalRs11: 0,
      totalRs12: 0,
      totalRs13: 0,
      totalRs15: 0,
      totalAmount: 0,
    }
  );
};
