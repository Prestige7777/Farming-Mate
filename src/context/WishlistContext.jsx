import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist, addToWishlist, removeFromWishlist } from '../utils/api';
import { useAuth } from '../components/auth/AuthProvider';

const WishlistContext = createContext(null);

/*
이 코드의 목적은 위시리스트(Wishlist) 관련 데이터를 전역적으로 관리하기 위해 Context를 만들 준비하는 것.

useState로 위시리스트 상태를 들고

useEffect로 서버에서 불러오고 (이때의 Effect : 데이터 가져오기)

addToWishlist, removeFromWishlist 같은 API(메뉴판/주문서) 함수로 데이터 수정

이 모든 걸 WishlistContext.Provider로 감싸서 앱 어디서든 useContext(WishlistContext)로 꺼내 쓸 수 있게 함
*/

export const WishlistProvider = ({ children }) => {    //WishlistProvider라는 컴포넌트를 정의
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

/*
- wishlistItems: 위시리스트에 담긴 상품 목록 (배열)
- setWishlistItems: 위시리스트를 업데이트하는 함수
- loading: 지금 서버에서 데이터를 가져오는 중인지 나타내는 불리언 값
- setLoading: 로딩 상태 변경 함수
*/

  useEffect(() => {
    const fetchWishlist = async () => {     // useEffect : user값이 바뀔 때마다 실행됨, fetchWishlist : 위시리스트를 서버에서 불러오는 비동기 함수를 정의
      if (user && user.id) {                // user가 존재하고 user.id가 있을 때 → 로그인된 상태
        setLoading(true);                   // setLoading(true): 불러오기 시작했으니 로딩 중으로 표시
        try {
          const items = await getWishlist(user.id);     // getWishlist(user.id): API 요청 → 서버에서 해당 유저의 위시리스트 데이터 가져옴
          setWishlistItems(items);          // 성공 → setWishlistItems(items)로 상태 업데이트
        } catch (error) {             
          console.error("Failed to fetch wishlist:", error);    // 실패 → 콘솔에 에러 찍고, setWishlistItems([])로 비워버림
          setWishlistItems([]);
        } finally {                         // finally: 성공/실패 상관없이 로딩 종료(setLoading(false))
          setLoading(false);
        }
      } else {
        setWishlistItems([]);             // 로그인 안 된 상태라면 위시리스트는 빈 배열 ([])->이거는 빈 배열이라는 뜻
        setLoading(false);                // 로딩 상태도 false
      }
    };
    fetchWishlist();                      //fetchWishlist() 호출 → 실제로 데이터 가져오기 실행
  }, [user]);

/*
WishlistProvider는:

로그인한 유저가 있으면 → 그 유저의 위시리스트를 서버에서 불러옴

로그인 안 되어 있으면 → 위시리스트는 비워둠

로딩 상태(loading)를 관리해서, UI에서 "불러오는 중..." 같은 표시도 가능하게 함

최종적으로 wishlistItems와 loading을 Context에 공급하게 될 것임
*/

  const addOrRemoveFromWishlist = async (productId) => {  //const : 변수를 선언하는 방법 중 하나
    if (!user) {
      alert('로그인 후 관심 상품을 이용해주세요.');
      return;
    }

    const existingItem = wishlistItems.find(item => item.productId === productId && item.userId === user.id);

    try {
      if (existingItem) {
        await removeFromWishlist(existingItem.id);
        setWishlistItems(wishlistItems.filter(item => item.id !== existingItem.id));
        alert('관심 상품에서 제거되었습니다.');
      } else {
        const newItem = {
          userId: user.id,
          productId: productId,
        };
        const response = await addToWishlist(newItem);
        setWishlistItems([...wishlistItems, response]);
        alert('관심 상품에 추가되었습니다.');
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      alert('관심 상품 업데이트에 실패했습니다.');
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId && item.userId === user?.id);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, loading, addOrRemoveFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
