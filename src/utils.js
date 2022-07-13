/**
 * 生成从start 到 end 之间的随机数
 * @param {int} start 
 * @param {int} end 
 */
function randomRange(start, end) {
  if (typeof start !== 'number' || typeof end !== 'number') {
    return -1;
  }
  let range = end - start;

  return Math.floor(Math.random() * range + start);
}


module.exports = {
  randomRange
};