export function getDefaultRoomAllocation(guest, rooms) {
  const { adult: totalAdults, child: totalChildren } = guest;
  const n = rooms.length;

  // 初始化dp陣列以記錄最小總價格和對應分配
  let dp = Array.from({ length: totalAdults + 1 }, () =>
    Array(totalChildren + 1).fill(Infinity)
  );
  let allocation = Array.from({ length: totalAdults + 1 }, () =>
    Array(totalChildren + 1).fill(null)
  );

  dp[0][0] = 0;

  // 動態規劃來計算最小價格
  for (let i = 0; i < n; i++) {
    const { roomPrice, adultPrice, childPrice, capacity } = rooms[i];

    for (let a = totalAdults; a >= 0; a--) {
      for (let c = totalChildren; c >= 0; c--) {
        for (let aa = 0; aa <= Math.min(capacity, a); aa++) {
          const cc = Math.min(capacity - aa, c);

          if (aa + cc > 0) {
            // 只分配有價值的組合
            const cost = roomPrice + aa * adultPrice + cc * childPrice;

            if (dp[a][c] > dp[a - aa][c - cc] + cost) {
              dp[a][c] = dp[a - aa][c - cc] + cost;
              allocation[a][c] = { room: i, adult: aa, child: cc, price: cost };
            }
          }
        }
      }
    }
  }

  // 如果無法分配全部住客
  if (dp[totalAdults][totalChildren] === Infinity) {
    return Array(n).fill({ adult: 0, child: 0, price: 0 });
  }

  // 重建分配結果
  const result = Array(n).fill({ adult: 0, child: 0, price: 0 });
  let a = totalAdults,
    c = totalChildren;
  while (a > 0 || c > 0) {
    const { room, adult, child, price } = allocation[a][c];
    result[room] = { adult, child, price };
    a -= adult;
    c -= child;
  }

  return result;
}
