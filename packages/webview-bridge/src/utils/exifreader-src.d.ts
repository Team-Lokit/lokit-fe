/**
 * exifreader의 src(ESM) 서브패스에는 타입 선언이 동봉돼 있지 않다.
 * 패키지 루트('exifreader')의 타입을 그대로 재사용해 타입 안전성을 유지한다.
 * (RN/Metro 호환을 위해 값은 src에서 import하되 타입만 루트에서 빌려온다)
 */
declare module 'exifreader/src/exif-reader.js' {
  export const load: typeof import('exifreader').load;
}
