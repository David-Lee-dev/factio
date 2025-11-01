// pnpm 설정 파일
module.exports = {
  hooks: {
    readPackage(pkg) {
      // 필요한 경우 패키지 설정 수정
      return pkg;
    },
  },
};
