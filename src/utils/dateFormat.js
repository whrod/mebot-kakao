//yyyy-mm-dd 포맷 날짜 생성
const getTodayInNotionFormat = () => {
  let today = new Date();
  return (
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1 > 9
      ? (today.getMonth() + 1).toString()
      : '0' + (today.getMonth() + 1)) +
    '-' +
    (today.getDate() > 9
      ? today.getDate().toString()
      : '0' + today.getDate().toString())
  );
};

//서버시간 -> 한국시간으로
// const currentKoreaTime = (serverTime) => {
//   return new Date(Date.parse(serverTime) + 3600000 * 9);
// };

module.exports = {
  getTodayInNotionFormat,
};
