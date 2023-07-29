# shopping-mall 프로젝트
## 프로젝트 개요
온라인 쇼핑몰 프로젝트입니다. 회원가입, 상품 등록, 결제, 리뷰 등 일상적인 온라인 쇼핑물의 기능을 갖추고 있습니다. vue.js, nestJS, graphQL을 활용하여 프론트부터 백엔드 그리고 배포까지 스스로 완결된 프로젝트를 만들어보기 위해서 진행한 프로젝트입니다.

<br>

 👉 프로젝트의 상세한 설명은 [Wiki](https://github.com/HaewoongGit/shopping-mall/wiki)를 참고해주세요.
 👉 프로젝트 사이트 주소: https://woong-shopping.shop/

<br>

## 프로젝트 기간
2023년 3월 ~ 2023년 7월

<br>

## 기술 스택
| Front-end | Bacn-end |
| :---:     | :---:    |
| Vue3   | nestJS   |
| Vuex  | TypeORM  |
| Axios | graphQL |
| Apollo Client | Apollo Server |

<br>

## 사용한 라이브러리
#### 백엔드 모듈
| 모듈 이름 | 버전 | 설명 |
|:--------:|:------:|:--------:|
| `@google-cloud/storage` | `^6.11.0` | Google Cloud Storage에 대한 Node.js 클라이언트 |
| `@nestjs/apollo` | `^10.1.6` | Nest.js 프레임워크를 위한 Apollo GraphQL Server 통합 |
| `@nestjs/common` | `^9.0.0` | Nest.js 프레임워크를 위한 일반적인 기능 모듈 |
| `@nestjs/config` | `^2.2.0` | Nest.js 환경 설정 로딩 및 사용을 위한 모듈 |
| `@nestjs/core` | `^9.0.0` | Nest.js의 핵심 기능 모듈 |
| `@nestjs/graphql` | `10.0.5` | Nest.js에서 GraphQL API를 구현하는 데 필요한 모듈 |
| `@nestjs/jwt` | `^10.0.3` | JWT(Json Web Token)를 사용한 인증을 위한 모듈 |
| `@nestjs/passport` | `^9.0.0` | Passport.js를 사용한 인증을 위한 모듈 |
| `@nestjs/platform-express` | `^9.0.0` | Express.js 기반의 Nest.js 애플리케이션을 만들기 위한 모듈 |
| `@nestjs/typeorm` | `^9.0.1` | TypeORM을 Nest.js에서 사용하기 위한 모듈 |
| `@types/mocha` | `^10.0.1` | Mocha를 사용하는 TypeScript 프로젝트를 위한 타입 정의 |
| `apollo-server-express` | `^3.11.1` | Express.js와 함께 사용할 수 있는 GraphQL 서버 구현 |
| `bcrypt` | `^5.1.0` | 비밀번호 해싱을 위한 라이브러리 |
| `class-validator` | `^0.14.0` | 객체 유효성 검사를 위한 라이브러리 |
| `graphql` | `^16.6.0` | GraphQL 쿼리 및 스키마 정의를 위한 JavaScript 라이브러리 |
| `graphql-upload` | `13.0.0` | GraphQL로 파일 업로드를 처리하는 데 사용되는 모듈 |
| `iamport` | `^0.3.4` | 아임포트 결제 모듈 |
| `jest-mock-express` | `^0.1.1` | Express.js 애플리케이션 테스팅을 위한 Jest Mock |
| `mysql2` | `^3.1.0` | MySQL 데이터베이스 드라이버 |
| `passport` | `^0.6.0` | 사용자 인증을 처리하는 미들웨어 |
| `passport-google-oauth20` | `^2.0.0` | Google OAuth 2.0 전략을 위한 Passport 모듈 |
| `passport-jwt` | `^4.0.1` | JWT 기반 인증을 위한 Passport 전략 |
| `serve-static` | `^1.15.0` | 정적 파일 서비스를 위한 미들웨어 |
| `typeorm` | `^0.3.10` | TypeScript와 JavaScript(ES7, ES6, ES5)를 위한 ORM |

<br>

#### 프론트엔드 모듈
| 모듈 이름 | 버전 | 설명 |
|:--------:|:------:|:--------:|
| `@apollo/client` | `3.3.19` | GraphQL 데이터 관리를 위한 모든 기능을 갖춘 클라이언트 |
| `@fortawesome/vue-fontawesome` | `^3.0.2` | Vue.js에서 Fontawesome을 사용하기 위한 라이브러리 |
| `@popperjs/core` | `^2.11.8` | 웹사이트에서 팝업 슬롯을 관리하는 라이브러리 |
| `@vue/apollo-composable` | `^4.0.0-beta.5` | Vue.js에서 Apollo GraphQL을 사용하기 위한 컴포저블 함수 |
| `@vue/apollo-option` | `^4.0.0-beta.5` | Vue.js에서 Apollo GraphQL을 사용하기 위한 옵션 API |
| `apollo-boost` | `^0.4.9` | Apollo Client를 더 쉽게 설정할 수 있게 해주는 패키지 |
| `apollo-cache-inmemory` | `^1.6.6` | Apollo 클라이언트의 인메모리 캐시 |
| `apollo-client` | `^2.6.10` | 강력한 GraphQL 클라이언트 |
| `apollo-link-http` | `^1.5.17` | 네트워크 인터페이스로 HTTP를 사용하는 GraphQL 연결을 생성 |
| `axios` | `^1.2.2` | HTTP 통신을 위한 Promise 기반의 라이브러리 |
| `bootstrap` | `^5.2.3` | 웹사이트 디자인을 쉽게 만들 수 있도록 돕는 CSS 프레임워크 |
| `graphql` | `15.8.0` | GraphQL 쿼리 및 스키마 정의를 위한 JavaScript 라이브러리 |
| `graphql-tag` | `^2.12.6` | GraphQL 쿼리를 JavaScript에서 파싱하는 데 사용되는 라이브러리 |
| `popper.js` | `^1.16.1` | 웹사이트에서 툴팁, 팝오버, 드롭다운 등의 위치를 관리하는 라이브러리 |
| `prettier` | `^2.8.8` | 코드 포매터로써, 코드의 스타일과 일관성을 유지 |
| `vue` | `^3.2.13` | 사용자 인터페이스를 구축하기 위한 프로그레시브 프레임워크 |
| `vue-apollo` | `^3.1.0` | Vue.js 애플리케이션 내에서 Apollo/GraphQL을 사용할 수 있게 하는 라이브러리 |
| `vue-router` | `^4.1.6` | Vue.js에서 라우팅을 처리하는 공식 라이브러리 |
| `vuex` | `^4.1.0` | Vue.js 애플리케이션의 상태 관리 라이브러리 |


<br>

## 프로젝트 아키텍처

![프로젝트 아키텍처](https://github.com/HaewoongGit/shopping-mall/assets/107612118/d81c8452-7d83-4a36-a6f7-c39da1de1704)



<br>

## 데이터베이스 ERD
https://www.erdcloud.com/d/G3t4Q554YAN4qrazx
![image](https://github.com/HaewoongGit/shopping-mall/assets/107612118/4a69526a-24ce-4fb6-9bb4-a57d825ff5d9)
