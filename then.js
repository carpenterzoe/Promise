
let p = new Promise((resolve, reject) => {
  resolve()
})

/** 
  let promise2 = p.then(() => {
    return promise2
  }).then(null, err => {
    console.log(err, 'err')
  })
*/

// ??? 上面写法和下面的区别 ???
// 老师讲解的是  上面的promise2 是 then执行了2次的
// 底下这个 Promise2 是 then一次的

// !!!??  两种情况 待验证，并且 这是为什么，内部怎么执行的????

let promise2 = p.then(() => {
  return promise2
})

promise2.then(null, err => {
  console.log(err, 'err')
})

