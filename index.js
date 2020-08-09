/**
 * * index.js 进行原生Promise演示
 * * promise.js 进行自定义的Promise演示
 * * test.js 对自定义的promise.js进行测试
 * * 开发过程结合 Promise/A+ 规范
 */
console.log(1)
new Promise((resolve, reject) => {
  console.log(2)
  resolve(1)
})
// * 如果 then接收的参数不是函数，实际上promise会把resolve的值重新包装return，给下一次then接收
// .then()
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