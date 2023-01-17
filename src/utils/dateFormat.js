const getTodayInNotionFormat = () => {
  //yyyy-mm-dd 포맷 날짜 생성
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
//TODO: 브라우저 표준시간 확인 작업 필요

module.exports = {
  getTodayInNotionFormat,
};
