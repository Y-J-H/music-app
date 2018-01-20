export function shuffle (arr) {   // shuffle方法就是将一个数组打乱并返回
  // 这句话是为了深拷贝数组, 为了防止当我们在这里改变数组的时候，注意数组是一个引用对象
  // 那么其他地方当我们使用到的时候,其数组其实已经改变了,这样的话并不是我们希望的
  var [..._arr] = arr
  for (let i = 0; i < _arr.length; i++) {
    let s = getRandom(0, i)
    let temp = _arr[s]
    _arr[s] = _arr[i]
    _arr[i] = temp
  }
  return _arr
}

/**
 * 随机生成一个min到max之间的数
 */
function getRandom (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
