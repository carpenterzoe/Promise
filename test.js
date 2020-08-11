const Promise = require('./promise')

console.log(1)
new Promise((resolve, reject) => {
  // throw new Error('haha wo cuo le')
  console.log(2)
  setTimeout(() => {
    resolve(1)
  })
})
.then( 
  value => {
    console.log(4)
    console.log('value', value)
  },
  reason => {
    console.log('reason', reason)
  }
)
console.log(3)

/**
 * ! promise返回值 2 种  ---  1.返回promise   2.返回普通值
 * ! 如果一个promise的then方法中的函数(成功和失败) 返回的结果是一个 [promise]
 * ? 会自动将这个promise执行 并采用它的状态  ??   --  在哪里执行, 怎么执行的???
 * ! 如果成功, 会将成功的结果向外层的下一个then传递
 * 
 * ! 如果返回的是一个[普通值], 那么会将这个普通值作为下一次的[成功]的结果
 * ! 哪怕是上一级执行了 reject, 返回的普通值, 也会走到下一个 then
 * ! 也就是说 失败的 then 后面, 可能会走到 下一个then 成功的 resolve
 * 
 * !!! 每次执行promise的时候, 都会返回一个新的promise实例
 */