// src/components/auth/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAllUsers, createUser } from '../../utils/api'; // Import API functions

const AuthContext = createContext(null);

// 로컬스토리지 키
const LS_USER = 'auth_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

/*
AuthProvider를 쉽게 설명하면?

AuthProvider는 “앱 전체에 로그인 정보를 나눠주는 상자” 같은 거예요.
그 안에서 두 가지 중요한 상태를 관리합니다:

user → 지금 로그인한 사람 정보

처음에는 null (로그인 안 한 상태)

로그인하면 setUser(...)로 사용자 정보 저장
👉 예: { name: "홍길동", email: "test@test.com" }

loading → 로그인 확인이 끝났는지 여부

처음엔 true (아직 서버에서 확인 중)

다 확인하면 setLoading(false) (확인 완료)
👉 로딩이 끝나야 "로그인 했는지, 안 했는지" 판단 가능
*/

  useEffect(() => {
    try {
      // 기존 로그인 유지
      const rawUser = localStorage.getItem(LS_USER);
      if (rawUser) setUser(JSON.parse(rawUser));
    } catch (e) {
      console.warn('Auth init error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

/*
✨ 요약 정리 ✨

try { ... } catch { ... } finally { ... }

try: 해보고 싶은 코드 넣기

catch: 실패(에러)하면 여기서 처리   ★ 에러 처리 ★

finally: 성공이든 실패든 마지막에 무조건 실행

localStorage.getItem(LS_USER)

브라우저 안에 있는 작은 저장소(localStorage)에서
LS_USER라는 이름으로 저장된 로그인 정보를 꺼내옴.

항상 "문자열" 형태로 꺼내짐.
👉 예: '{"name":"홍길동"}'

if (rawUser) setUser(JSON.parse(rawUser));

로그인 정보가 있으면(JSON이 문자열) → JSON.parse로 객체로 바꾼 뒤
setUser로 사용자 상태를 저장 = 로그인 유지

catch (e)

만약 JSON이 깨져서 불러오기 실패하면
→ 에러를 잡아서 콘솔에 경고 출력

finally { setLoading(false); }

무조건 마지막에 로딩을 끝냄.

그래야 화면이 "계속 로딩 중…" 상태에 갇히지 않음.
*/


  const updateUserContext = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(LS_USER, JSON.stringify(updatedUser));
  };
  /*
이 함수가 하는 일

setUser(updatedUser)
→ React 안에서 쓰는 user 상태를 새 값으로 바꿔줌
👉 화면에 즉시 반영됨 (예: 로그인 이름 바뀌어 보임)

localStorage.setItem(...)
→ 브라우저 저장소(localStorage)에도 똑같은 사용자 정보를 저장
👉 새로고침하거나 브라우저를 꺼도 로그인 정보가 남아 있음

쉽게 말하면

지금 화면용(user 상태) + 브라우저 저장용(localStorage)
두 군데에 동시에 사용자 정보를 업데이트하는 함수예요.

👉 그래서 로그인, 로그아웃, 프로필 수정 같은 순간에 이 함수를 불러서
**“사용자 정보를 최신으로 유지”**하는 거죠.

JSON.stringify란?

역할: 자바스크립트 객체(Object)를 문자열(String)로 바꿔주는 함수예요.

왜 필요할까?
👉 localStorage는 문자열만 저장할 수 있어요.
👉 그래서 { name: "홍길동", age: 20 } 같은 객체는 그냥 저장 못 하고,
"{"name":"홍길동","age":20}" 이렇게 문자열로 바꿔서 저장해야 합니다.
  */

  const login = async (email, password) => {
    setLoading(true);
    try {
      const users = await getAllUsers(); // Fetch users from json-server
      const found = users.find(u => u.email === email && u.password === password);
      if (found) {
        updateUserContext(found);
        return { success: true, user: found };
      } else {
        return { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
      }
    } catch (e) {
      console.error("Login error:", e);
      return { success: false, message: '로그인 중 오류가 발생했습니다.' };
    } finally {
      setLoading(false);
    }
  };
/*
1. const login = async (email, password) => { ... }
login은 비동기 함수(async) → 안에서 await를 쓸 수 있어요.
[비동기 함수 : 시간이 오래 걸리는 일을 기다리지 않고, 먼저 다른 일을 할 수 있음.]
매개변수: email, password
→ 사용자가 로그인 폼에서 입력한 값.

2. setLoading(true);
로그인 시도를 시작했으니 로딩 상태 on.
화면에서 "로그인 중..." 같은 표시를 할 수 있게 해줌.

3. const users = await getAllUsers();
json-server에서 모든 사용자 정보를 가져옴.
await 덕분에 서버 응답을 받을 때까지 기다렸다가 users 변수에 담음.

4. const found = users.find(...)
users 배열에서 email과 password가 둘 다 일치하는 사용자를 찾음.
찾으면 found에 그 사용자 객체가 들어가고, 못 찾으면 undefined.

5. if (found) { ... } else { ... }
if (found) → 사용자가 존재하면
updateUserContext(found);
→ 상태(user) + localStorage 업데이트 = 로그인 유지
{ success: true, user: found } 반환
→ 로그인 성공 결과를 리턴
else → 못 찾으면
{ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' } 반환

6. catch (e) { ... }
서버 연결 실패, 코드 에러 등 문제가 생기면 여기로 옴.
콘솔에 에러 출력 + 실패 메시지 반환.
👉 "로그인 중 오류가 발생했습니다."

7. finally { setLoading(false); }
로그인 성공/실패/에러와 상관없이 무조건 실행.
로딩 상태를 해제 → 화면에서 "로그인 중..." 메시지 없어짐.
*/

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LS_USER);
  };

/*
1. setUser(null);

user 상태를 null로 바꿉니다.

즉, 앱 안에서 “로그인된 사용자 없음” 상태로 만듭니다.
👉 화면에서는 로그아웃된 것처럼 보이게 돼요.

2. localStorage.removeItem(LS_USER);

브라우저 저장소(localStorage)에 있던 로그인 정보(LS_USER 키로 저장된 값)를 지웁니다.

새로고침하거나 브라우저를 다시 열어도 로그인 기록이 남아있지 않게 합니다.

✅ 정리

이 함수는 로그아웃 버튼을 눌렀을 때 실행돼서:

앱 안에서 로그인 상태를 없애고 (setUser(null))

브라우저 저장소에서도 로그인 기록을 삭제합니다 (removeItem).

👉 한마디로 **“화면 + 저장소에서 로그인 흔적을 모두 지우는 코드”**예요.
*/

  const register = async ({ email, password, username }) => {
    setLoading(true);
    try {
      const users = await getAllUsers();
      if (users.some(u => u.email === email)) {
        return { success: false, message: '이미 존재하는 이메일입니다.' };
      } else {
        const newUser = {
          id: `u${Date.now()}`,
          email,
          password,
          name: username || '새 사용자',
          role: 'consumer',
          profileImageUrl: '',
          profileBgUrl: '',
          bio: '',
        };
        await createUser(newUser); // Create user via API
        return { success: true, message: '회원가입 성공! 로그인해주세요.' };
      }
    } catch (e) {
      console.error("Registration error:", e);
      return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUserContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
