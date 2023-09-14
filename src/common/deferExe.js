// 链式调用和延迟执行
function arrange(name) {
  const tasks = []

  tasks.push(() => {
    console.log(`${name} is notified`)
  })

  function doSomething(action) {
    tasks.push(() => console.log(`start to ${action}`))

    return this
  }
  function wait(sec) {
    tasks.push(
      () =>
        new Promise(resolve => {
          setTimeout(resolve, sec * 1000)
        })
    )

    return this
  }

  async function execute() {
    for (const t of tasks) {
      await t()
    }

    return this
  }

  function waitFirst(sec) {
    tasks.unshift(
      () =>
        new Promise(resolve => {
          setTimeout(resolve, sec * 1000)
        })
    )

    return this
  }

  return {
    do: doSomething,
    wait,
    execute,
    waitFirst,
  }
}

// arrange('william').execute()

// arrange('william').do('commit').execute()

// arrange('william').wait(5).do('commit').execute()

arrange('william').waitFirst(5).do('push').execute()
