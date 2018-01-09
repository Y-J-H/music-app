export function addClass (el, className) {
  if (hasClass(el, className)) {
    return ''
  }
  let classArr = el.className.split(' ')
  classArr.push(className)
  el.className = classArr.join(' ')
}

export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el, className)
}

// 获取标签上绑定的data
export function getData (el, name, val) {
  let prefix = 'data-'
  name = prefix + name
  if (val) {   // 若有val则调用setA设置值, 否则获取值
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}
