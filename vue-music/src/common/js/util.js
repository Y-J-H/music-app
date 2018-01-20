export function shuffle (arr) {   // shuffle方法就是将一个数组打乱并返回
  for (let i = 0; i < arr.length; i++) {
    let s = getRandom(0, i)
    let temp = arr[s]
    arr[s] = arr[i]
    arr[i] = temp
  }
  return arr
}

/**
 * 随机生成一个min到max之间的数
 */
function getRandom (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
