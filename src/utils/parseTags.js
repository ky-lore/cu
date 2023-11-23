module.exports = function (task) {
  return task.map(obj => {
    return obj.name
  })
}