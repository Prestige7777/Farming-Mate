// src/pages/MyPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import ProductCard from '../components/marketplace/ProductCard';
import StoryCard from '../components/story/StoryCard';
import { getAllProducts, getAllStories, getFarmerById, updateUser, updateProduct, deleteProduct } from '../utils/api';
import ReviewSection from '../components/marketplace/ReviewSection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EditProfileModal from '../components/common/EditProfileModal';
import EditProductModal from '../components/marketplace/EditProductModal';
import { DEFAULT_IMAGE_URL } from '../utils/constants';
import { useWishlist } from '../context/WishlistContext'; // useWishlist 임포트
import './MyPage.css';

const MyPage = () => {
  console.log("MyPage component rendering");  
  //화면이 다시 그려질 때마다(렌더링될 때마다)→ “MyPage component rendering”이라는 글자를 개발자 도구 콘솔창에 보여줍니다.

  const { user, loading: authLoading, updateUserContext } = useAuth();
  //useAuth()라는 도구(훅)를 사용해서 로그인 관련 정보를 가져옵니다.
  //user → 현재 로그인한 사용자 정보 (이름, 아이디, 역할 등)
  //authLoading → 로그인 확인 중인지 아닌지(true/false)
  //updateUserContext → 로그인한 사용자 정보를 바꿀 수 있는 함수

  const { wishlistItems } = useWishlist();
  //useWishlist()라는 도구를 써서, 찜한 상품(위시리스트)을 가져옵니다.
  //wishlistItems 안에는 사용자가 찜한 상품 목록이 들어있습니다.

  const [userProducts, setUserProducts] = useState([]);
  // → 내가 등록한 상품 목록. 처음에는 빈 배열 [].

  const [userStories, setUserStories] = useState([]);
  // → 내가 작성한 재배일지(농사 일기) 목록. 처음에는 빈 배열.

  const [farmerData, setFarmerData] = useState(null);
  // → 농부라면, 농부와 관련된 추가 정보. 처음에는 null (없음).

  const [pageLoading, setPageLoading] = useState(true);
  // → “마이페이지 화면 자체가 자료를 아직 불러오는 중인지”를 표시.
  // → 처음에는 true (로딩 중).

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  // → 프로필 수정 창(모달)이 열려 있는지 표시. 처음에는 닫혀있음(false).

  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  // → 상품 수정 창(모달)이 열려 있는지 표시. 처음에는 닫혀있음.
  
  const [editingProduct, setEditingProduct] = useState(null);
  // → 지금 수정하려고 선택한 상품의 정보. 처음에는 없음(null).


  useEffect(() => {
    // 화면이 그려진 뒤에 자동으로 실행할 코드를 적는 구간을 연다.
    if (authLoading) {
      // 아직 로그인 확인 중이라면…(= 기다려야 하는 상황이면)
      return; 
      // 여기서 끝낸다. 아래 코드는 실행하지 않음. (괜히 서두르지 않기기)
    }
    // 위 조건문 닫기
    if (!user) {
      // 로그인한 사람이 없다면... (사용자 정보가 비어 있다면)
      setPageLoading(false);
      // "로딩중" 표시를 끄기. (로그인 안 됐으면 더 가져올 데이터가 없음)
      return;
      // 여기서 끝낸다. 아래 코드는 실행하지 않음.
    }
    // 조건문 닫기

    // 즉, 로그인 확인중이면 아무것도 하지 않고 대기하고, 로그인이 안 되어있으면 로딩 표시 끄고 종료함. 
    // 둘 다 아니면(로그인 한 상태면) 이 아래에서 실제 데이터를 가져오는 코드를 이어서 실행하게 됨.

    const fetchData = async () => {
      // fetchData라는 이름의 비동기(시간이 걸리는 일을 기다렸다가 결과가 오면 계속 실행할 수 있음) 함수를 만듦
      // 비동기는 주로 서버에서 자료를 가져올 때 씀
      try {
        // 여기서부터 시도해보고, 만약 문제가 생기면 catch(밑에 error부분)로 넘어가겠다는 뜻.
        setPageLoading(true);
        // 로딩 상태를 켬. 화면에서 "로딩 중" 표시가 뜨도록 하는 역할.
        const [products, stories] = await Promise.all([
          getAllProducts(),
          getAllStories(),
        ]);
        // getAllProducts() = 서버에서 상품 전체 목록 가져오기
        // getAllStories() = 서버에서 재배 일지 전체 목록 가져오기
        // Promise.all([...]) → 두 개를 동시에 실행하고, 둘 다 끝날 때까지 기다린다.
        // 결과는 배열(여러 개의 값을 순서대로 담을 수 있는 상자)로 오는데, 첫 번째는 products, 두 번째는 stories에 담긴다.

        console.log("Fetched products:", products);
        console.log("Fetched stories:", stories);
        // 받아온 상품 데이터(products)와 일지 데이터(stories)를 개발자 도구 콘솔창에 출력한다.
        // 잘 가져왔는지 확인하기 위한 “디버깅(프로그램에서 문제를 찾아내고 고치는 과정)용” 메시지. 

        setUserProducts(products.filter(p => p.farmerId === user.id));
        // 전체 상품 목록(products) 중에서, p.farmerId === user.id 조건에 맞는 것만 뽑는다.
        // 즉, 현재 로그인한 농부(user)가 등록한 상품만 골라낸다.
        // 골라낸 결과를 setUserProducts에 저장 → 화면에 “내 상품”만 보이도록 함.
        setUserStories(stories.filter(s => s.farmerId === user.id));
        // 전체 일지 목록(stories) 중에서, s.farmerId === user.id 조건에 맞는 것만 뽑는다.
        // 즉, 현재 로그인한 농부가 작성한 재배 일지만 골라낸다.
        // 골라낸 결과를 setUserStories에 저장 → 화면에 “내 재배 일지”만 보이도록 함.

        if (user.role === 'farmer') {
          // 로그인한 사용자의 역할이 "farmer"(= 농부)인지 확인한다.
          // 농부라면 아래 코드를 실행하고, 아니면 건너뛴다.
          const farmer = await getFarmerById(user.id);
          // getFarmerById라는 함수를 이용해, 지금 로그인한 사용자의 아이디(user.id)로 농부 정보를 서버에서 가져온다.
          // await 때문에 데이터가 올 때까지 잠시 기다린다.
          // 결과는 farmer라는 변수에 담긴다.
          setFarmerData(farmer);
          // 방금 받아온 농부 정보를 화면에서 쓸 수 있도록 상태(farmerData)에 저장한다.
          // 이렇게 하면 “내 농부 정보”가 마이페이지에 나타날 수 있다.
        }

      } catch (error) {
        // 만약 위 과정에서 문제가 생기면(예: 서버가 꺼져 있거나, 인터넷 오류) 여기로 넘어온다.
        console.error("Failed to fetch user data:", error);
        // 에러 내용을 개발자 도구 콘솔창에 출력한다.
        // "Failed to fetch user data:"라는 글자와 함께, 어떤 에러인지도 같이 보여준다.
        // 즉, 문제 원인을 확인하기 위한 기록.
      } finally {
        // 성공했든 실패했든, 마지막에 무조건 실행되는 부분
        setPageLoading(false);
        // 페이지가 데이터를 다 불러오든, 실패하든 어쨌든 이제는 “로딩 중” 표시를 끈다.
        // 즉, 화면에서 로딩 스피너가 사라지고 결과를 보여줄 준비가 된다.
      }
    };
    // 함수의 끝을 알린다.

    // ★ 정리 ★
    // 로그인 한 사람이 농부라면 -> 농부 정보도 가져와 저장
    // 중간에 오류가 나면 -> 콘솔창에 에러 메세지를 찍음
    // 성공이든 실패든 마지막에는 -> "로딩 중" 표시를 꺼서 화면이 멈추지 않게 함.



    fetchData();
    // 위에서 만든 fetchData() 함수를 실행한다.
    // 이 함수는 서버에서 상품과 일지 데이터를 가져와서 내 것만 골라주는 역할이었죠.
  }, [user, authLoading]);
    // useEffect라는 구문을 닫는 부분.
    // [user, authLoading] → 이 둘이 변할 때마다 위의 fetchData()가 다시 실행된다.
    // 즉, 로그인한 사용자(user)가 바뀌거나, 로그인 로딩 상태(authLoading)가 끝나면 새로 데이터를 가져온다.

  const openEditProfileModal = () => setIsEditProfileModalOpen(true);
  // “프로필 수정 창(모달)”을 여는 함수.
  // 버튼을 누르면 이 함수가 실행돼서 모달이 열림(true).
  const closeEditProfileModal = () => setIsEditProfileModalOpen(false);
  // “프로필 수정 창(모달)”을 닫는 함수.
  // 닫기 버튼 누르면 실행돼서 모달이 닫힘(false).

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setIsEditProductModalOpen(true);
  };
  // “상품 수정 창(모달)”을 여는 함수.
  // 수정할 상품 하나(product)를 받아서 editingProduct에 저장.
  // 그리고 모달 열림(true).
  // 즉, “이 상품을 수정할 거야” 하고 선택 + 창 열기.
  const closeEditProductModal = () => {
    setEditingProduct(null);
    setIsEditProductModalOpen(false);
  };
  // “상품 수정 창(모달)”을 닫는 함수.
  // 닫을 때는 수정 대상(editingProduct)도 지워주고, 모달도 닫음(false).

  // 정리:
  // 1. 데이터 다시 가져오기 (fetchData 관련)
  //  - 로그인 정보가 바뀌거나 로딩이 끝나면 fetchData() 실행해서 최신 데이터로 갱신.
  
  // 2. 모달 열고 닫기 관리
  //  - 프로필 수정 모달: 열기/닫기 함수
  //  - 상품 수정 모달: 열기(상품 선택 + 열기)/닫기(상품 지우고 닫기) 함수


  const handleSaveProfile = async (updatedData) => {
    // handleSaveProfile라는 이름의 함수.
    // 이 함수는 사용자가 프로필 수정창(모달)에서 “저장(save)” 버튼을 눌렀을 때 실행된다.
    // updatedData는 사용자가 입력한 새 정보(예: 이름, 소개글 등).
    try {
      // 이 안의 코드를 실행해보고, 문제가 생기면 catch로 넘어간다.
      const updatedUser = await updateUser(user.id, updatedData);
      // updateUser라는 함수를 써서 서버에 “이 사용자의 정보를 새 값으로 바꿔 달라” 요청을 보낸다.
      // await → 서버에서 응답이 올 때까지 잠깐 기다림.
      // 결과(바뀐 사용자 정보)는 updatedUser에 담김.
      updateUserContext(updatedUser);
      // 방금 업데이트된 사용자 정보를 앱 내부에도 반영한다.
      // 이렇게 해야 화면에도 최신 프로필 정보가 바로 보인다.

      if (user.role === 'farmer') {
        const farmer = await getFarmerById(user.id);
        setFarmerData(farmer);
      }
      // 만약 이 사용자가 농부라면:
      // getFarmerById로 농부 정보를 새로 받아온다.
      // 그 정보를 setFarmerData에 저장해서 화면에 반영한다.
      // 👉 즉, 농부라면 일반 정보 + 농부 정보까지 최신으로 맞춰준다.

      alert("프로필이 성공적으로 업데이트되었습니다!");
      // 성공했을 때, 팝업창(alert)으로 사용자에게 알려준다.
      // 👉 “프로필이 잘 저장됐다!”
      closeEditProfileModal();
      // 수정창(모달)을 닫는다.
      // 👉 저장이 끝났으니 더 이상 열려 있을 필요가 없음.
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("프로필 업데이트에 실패했습니다.");
    }
    // 만약 중간에 문제가 생기면:
    // 콘솔창에 에러 내용을 기록해 개발자가 원인을 확인할 수 있게 한다.
    // 사용자에게는 “프로필 업데이트에 실패했습니다.”라고 팝업창으로 알려준다.
  };

    // 정리 (프로필 수정 저장 버튼을 눌렀을 때 실행되는 과정)
    // 1. 서버에 새 정보 저장 요청
    // 2. 성공하면 → 화면의 사용자 정보 최신화
    //  - 농부면 농부 정보도 갱신
    // 3. 성공 메시지(alert) 띄우고 창 닫기
    // 4. 실패하면 → 콘솔에 기록 + 실패 메시지(alert) 띄우기

  const handleSaveProduct = async (updatedProductData) => {
    // handleSaveProduct라는 함수.
    // “상품 수정하기” 창(모달)에서 저장 버튼을 누르면 실행된다.
    // updatedProductData = 사용자가 수정해서 제출한 상품 정보.
    try {
      // 이 안의 코드를 실행해보고, 문제가 생기면 밑의 catch로 넘어간다.
      const response = await updateProduct(updatedProductData.id, updatedProductData);
      // updateProduct라는 함수를 호출해서, 서버에 “이 상품(id)”을 “새로운 데이터”로 고쳐 달라고 요청한다.
      // await는 서버가 응답할 때까지 잠시 기다린다는 뜻.
      // 결과(수정된 상품 정보)는 response에 담긴다.
      setUserProducts(userProducts.map(p => p.id === updatedProductData.id ? response : p));
      // 현재 화면에 보여지고 있는 내 상품 목록(userProducts) 중에서,
      // 수정한 상품(updatedProductData.id)만 새 데이터(response)로 교체한다.
      // 나머지 상품은 그대로 둔다.
      // 이렇게 해서 화면도 서버 데이터와 똑같이 최신 상태로 만든다.

      alert("상품이 성공적으로 수정되었습니다!");
      // 성공했음을 알리는 팝업창 띄우기.
      // 👉 “상품 수정이 완료됐다”는 메시지.
      closeEditProductModal();
      // 상품 수정 창(모달) 닫기.
      // 이제 수정이 끝났으니 화면에서 창을 닫아준다.
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("상품 수정에 실패했습니다.");
    }
    // 만약 서버 요청이나 저장 과정에서 문제가 생기면 → 여기로 넘어옴.
    // 콘솔창에 에러 내용을 기록하고, 사용자에게는 “상품 수정에 실패했습니다.”라는 팝업창을 띄운다.
  };

  const handleDeleteProduct = async (productId) => {
    // handleDeleteProduct라는 함수.
    // 상품 하나를 삭제할 때 실행된다.
    // productId = 삭제할 상품의 고유 번호.
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      // 확인 창을 띄운다.
      // 사용자가 "확인"을 누르면 안쪽 코드 실행, "취소" 누르면 실행 안 함.
      // 👉 실수로 상품이 지워지는 걸 막기 위한 안전장치.
      try {
        await deleteProduct(productId);
        // deleteProduct 함수를 이용해 서버에 “이 상품(productId)을 지워 달라” 요청을 보낸다.
        // await → 서버 응답을 기다림.
        setUserProducts(userProducts.filter(p => p.id !== productId));
        // 화면에 보여주던 내 상품 목록(userProducts)에서, 방금 지운 상품(productId)만 빼고 새 목록을 만든다.
        // 이렇게 해서 화면에서도 삭제된 게 반영되도록 한다.
        alert('상품이 성공적으로 삭제되었습니다.');
        // 성공했음을 사용자에게 알리는 팝업창.
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert('상품 삭제에 실패했습니다.');
      }
      // 만약 서버 요청이 실패하면 여기 실행.
      // 콘솔에 에러 기록 남기고, 사용자에게는 “삭제 실패” 알림을 보여준다.
    }
  };
      // 정리 (상품 삭제 버튼을 눌렀을 때 실행되는 과정)
      // 1. 확인창으로 사용자에게 진짜 지울 건지 묻기
      // 2. 확인하면 → 서버에 삭제 요청 보내기
      // 3. 성공 시 → 내 상품 목록에서 지운 상품 제거 → 알림창 띄우기
      // 4. 실패 시 → 콘솔에 기록 + 실패 알림창 띄우기

  if (authLoading || pageLoading) {
    // 로그인 확인 중(authLoading)이거나,
    // 마이페이지 데이터 가져오는 중(pageLoading)이면,
    return <LoadingSpinner />;
    // 화면에는 **로딩 표시(빙글빙글 돌아가는 아이콘)**만 보여준다.
    // 👉 아직 준비가 안 되었으니 다른 화면은 안 보여주고 대기.
  }

  if (!user) {
    // 모든 로딩이 끝났는데,
    // 로그인한 사용자가 없다면(!user) → 로그인이 안 된 상태라는 뜻.
    return (
      <div className="my-page-needs-login">
        <div className="login-prompt-card">
          <h1 className="login-prompt-title">로그인이 필요합니다.</h1>
          <p className="login-prompt-text">마이페이지를 이용하려면 로그인해주세요.</p>
          <Link to="/login">
            <Button>로그인 하러가기</Button>
          </Link>
        </div>
      </div>
    );
  }
  // “로그인이 필요합니다”라는 안내문과 함께
  // 로그인 페이지로 이동할 수 있는 버튼을 보여준다.
  // 👉 로그인하지 않은 사람은 마이페이지 대신 로그인 안내 화면을 보게 됨.


  // ✨ 정리 (마이페이지에 들어왔을 때 상황에 따라 다른 화면을 보여주는 부분)
  // 1. 로그인 확인 중이거나, 페이지 데이터 가져오는 중이면 → 로딩 화면
  // 2. 준비 끝났는데 로그인 안 되어 있으면 → “로그인 필요” 안내 화면
  // 3. (로그인 되어 있으면) → 아래 코드에서 마이페이지 본문을 보여주게 됨
  
  const isFarmer = user.role === 'farmer';
  // 사용자의 역할이 "farmer"인지 확인.
  // 농부라면 isFarmer가 true, 아니면 false.
  const mockReviews = [
    { id: 'rev001', author: '김소비', rating: 5, date: '2023-10-25', content: '정말 신선하고 맛있어요! 재구매 의사 100%입니다.' },
    { id: 'rev002', author: '박주부', rating: 4, date: '2023-10-23', content: '배송도 빠르고 상품도 좋습니다. 믿고 먹을 수 있어요.' },
  ];
    // 샘플 리뷰 데이터 2개를 미리 만들어둔 것. 진짜 서버 데이터가 아니라 화면 테스트용.

  return (
    <div className="my-page"> 
   {/*화면에 보여줄 내용을 반환(return).*/}
   {/*<div className="my-page"> → 마이페이지 전체 영역을 감싸는 상자.  */}  
      <section 
        className="profile-banner"
        style={{ backgroundImage: `url(${user.profileBgUrl || DEFAULT_IMAGE_URL})` }}
      >
         {/*마이페이지의 맨 위 배너(프로필 배경 영역) */}
         {/*style={{ backgroundImage: ... }} → 배경 이미지를 설정 */}
         {/* - 사용자가 배경 사진(user.profileBgUrl)을 올렸으면 그걸 사용 */}
         {/* - 없으면 기본 이미지(DEFAULT_IMAGE_URL) 사용 */}
        <div className="profile-banner-content">
          {/* 배너 안에 들어갈 글씨(내용)를 감싸는 상자 */}
          <h1 className="profile-banner-title">{isFarmer ? (farmerData?.farmName || user.name) : user.name}</h1>
          {/* 큰 제목 부분 */}
          {/*만약 농부라면: */}
          {/* 농장 이름(farmerData?.farmName)이 있으면 농장 이름 표시 */}
          {/* 농장 이름이 없으면 그냥 사용자 이름(user.name) 표시 */}
          {/* 농부가 아니라면 그냥 사용자 이름만 표시 */}
          {isFarmer && (farmerData?.location || farmerData?.address) && <p className="profile-banner-location">{farmerData.location || farmerData.address}</p>}
          {/* 농부라면(isFarmer), 그리고 주소나 위치 정보가 있으면 → <p> 태그 안에 그 위치 정보를 표시 */}
          {/* 👉 즉, 농부일 때만 “농장 위치”가 배너에 나타남 */}
        </div>
      </section>

      <main className="my-page-main">
        {/* 마이페이지의 메인(본문) 영역을 시작한다.*/}
        <section className="profile-details">
          <div className="profile-details-content">
            {/* 사용자 프로필을 보여주는 영역 시작.*/}
            <div className="profile-header">
              <div className="profile-avatar-container">
                <img
                  src={user.profileImageUrl || DEFAULT_IMAGE_URL}
                  alt={`${user.name} 프로필 이미지`}
                  className="profile-avatar-img"
                />
              </div>
              {/* 프로필 사진을 보여준다 */}
              {/* 사용자가 사진을 올렸으면 user.profileImageUrl 사용, 없으면 기본 이미지(DEFAULT_IMAGE_URL) 사용 */}
              {/* alt는 사진이 안 보일 때 대신 보이는 글씨 */}

              <div className="profile-meta">
                <div className="profile-meta-top">
                  <h2 className="profile-name-details">
                    <span className="farmer-name">{user.name}</span>
                    {isFarmer && <span className="farmer-title">농부님</span>}
                  </h2>
                  <div className="profile-actions-container">
                    <Button variant="outline" onClick={openEditProfileModal}>프로필 편집</Button>
                  </div>
                </div>
                {/* 사용자 이름 보여주기 (user.name) */}
                {/* 만약 농부라면 이름 옆에 "농부님" 표시 */}
                {/* 오른쪽에는 프로필 편집 버튼이 있어서, 누르면 프로필 수정창(모달)이 열림 */}
                
                <div className="profile-stats">
                  <span>재배일지 <strong>{userStories.length}</strong></span>
                  <span>팔로워 <strong>0</strong></span>
                  <span>팔로우 <strong>0</strong></span>
                </div>
                {/* 내가 작성한 재배일지 개수 보여주기 (userStories.length) */}
                {/* 팔로워/팔로우는 지금은 0으로 표시됨. (아직 기능 미구현) */}
              </div>
            </div>

            <div className="profile-bio-container">
              <p className="profile-bio">{user.bio || '소개글이 없습니다.'}</p>
            </div>
            {/* 사용자가 작성한 소개글(user.bio) 보여주기 */}
            {/* 소개글이 없다면 → “소개글이 없습니다.” 문구 표시 */}
          </div>
        </section>

        {isFarmer && (
          <section className="my-product-section">
            <div className="section-content-wrapper">
              <div className="section-header">
                <h2 className="section-title">판매 상품 ({userProducts.length})</h2>
                <Link to="/products/new" className="add-content-link">
                  <Button variant="outline">상품 등록하기</Button>
                </Link>
              </div>
               {/* 만약 농부라면(isFarmer) 판매 상품 영역을 보여줌 */}
               {/*제목에 내가 등록한 상품 개수 표시 (userProducts.length) */}
               {/* 오른쪽에 "상품 등록하기" 버튼 → 누르면 /products/new 페이지로 이동 */}
              <div className="product-grid">
                {/* 내가 올린 상품이 하나 이상 있으면 -> 아래 내용을 보여줘 */}
                {userProducts.length > 0 ? (
                  userProducts.map(product => (
                    <div key={product.id} className="product-card-wrapper"> 
                    {/* 각 상품을 싸는 작은 상자.
                        key={product.id}: 각 아이템을 구별하는 번호표(중복X). 화면이 바뀔 때 헷갈리지 말라고 붙임.*/}
                      {/* 카드 안에서 농부 프로필 부분은 숨겨라는 뜻. (마이페이지니까 굳이 또 안 보여도 됨) */}
                      <ProductCard
                        product={product}
                        hideFarmerProfile={true}
                        isMyPage={true}
                        onEdit={openEditProductModal}
                        onDelete={handleDeleteProduct}
                      />
                      {/* 마이페이지에서 쓰는 카드다 라는 표시. (카드가 마이페이지용 스타일/동작으로 바뀔 수 있음)*/}
                      
                    </div>
                  ))
                ) : (
                  <p className="empty-message">등록된 상품이 없습니다.</p>
                )}
              </div>
               {/* 내가 등록한 상품이 하나라도 있다면 → map을 돌면서 <ProductCard>로 카드 하나씩 보여줌 */}
                {/* - onEdit → 수정 버튼 눌렀을 때 실행할 함수 */}
                {/* - onDelete → 삭제 버튼 눌렀을 때 실행할 함수 */}
               {/* 등록된 상품이 없으면 → "등록된 상품이 없습니다."라는 안내 문구 표시 */}
            </div>
          </section>
        )}

        {/* 정리 (마이페이지의 본문(main)을 구성하는 부분) */}
        {/* 1. 프로필 구역
              - 프로필 사진
              - 이름 (농부면 "농부님" 표시)
              - 프로필 편집 버튼
              - 재배일지 개수 / 팔로워 / 팔로우
              - 자기소개
            2. 판매 상품 구역 (농부일 때만 보임)
              - 상품 개수
              - 상품 등록 버튼
              - 내가 올린 상품들 카드 목록 (수정/삭제 가능)
              - 상품 없으면 “등록된 상품이 없습니다” 문구 */}

        
        <section className="my-story-section">
          {/*재배 일지를 모아놓은 구역을 시작한다.
             CSS에서 my-story-section이라는 스타일이 적용됨.*/}
          <div className="section-content-wrapper">
            {/*안의 내용을 감싸는 통(box).
               배치나 여백 같은 디자인을 정리하기 위한 컨테이너.*/}
            <div className="section-header">
              <h2 className="section-title">재배 일지 ({userStories.length})</h2>
              {isFarmer && (
                <Link to="/stories/new" className="add-content-link">
                  <Button variant="outline">재배일지 작성하기</Button>
                </Link>
              )}
            </div>
              {/* 큰 제목: "재배 일지"
                  괄호 안 숫자: 내가 쓴 일지 개수 (userStories.length).
                  만약 내가 농부라면(isFarmer) → "재배일지 작성하기" 버튼이 나타남.
                  버튼을 누르면 /stories/new로 이동 → 새 일지 작성 화면으로 감. */}
            <div className="story-grid">
              {userStories.length > 0 ? (
                userStories.map(story => (
                  <StoryCard
                    key={story.id}
                    story={{
                      ...story,
                      farmerName: user.name,
                      farmerProfileImageUrl: user.profileImageUrl
                    }}
                    hideFarmerProfile={true}
                  />
                ))
              ) : (
                <p className="empty-message">아직 작성된 재배 일지가 없습니다.</p>
              )}
            </div>
            {/* userStories.length > 0 → 내가 쓴 일지가 하나 이상 있으면
                 - map으로 목록을 돌면서 <StoryCard>라는 카드 컴포넌트를 하나씩 만든다.
                 - 각 카드에 story 정보를 넘기는데, 원래 story에 더해서:
                   - farmerName: 내 이름
                   - farmerProfileImageUrl: 내 프로필 사진
                 - hideFarmerProfile={true} → 마이페이지에서는 어차피 내 글이니까 작성자 프로필은 숨김.
                userStories.length === 0 → 일지가 하나도 없으면
                 - "아직 작성된 재배 일지가 없습니다."라는 안내 문구를 보여줌. */}
          </div>
        </section>

        {!isFarmer && (
          <ReviewSection reviews={mockReviews} />
        )}
        {/* !isFarmer → 농부가 아닌 경우에만 실행.
            소비자라면 ReviewSection을 보여줌.
            reviews={mockReviews} → 샘플 리뷰(mockReviews)를 전달해서 화면에 출력.
            👉 즉, 소비자는 리뷰 영역을 보고, 농부는 보지 않는다. */}
      </main>

      {user && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={closeEditProfileModal}
          currentUser={user}
          onSave={handleSaveProfile}
        />
      )}
      {/* - 로그인한 사용자(user)가 있을 때만 실행.
          - EditProfileModal → 프로필 수정 창(모달).
          - 속성들:
            - isOpen={isEditProfileModalOpen} → 열림/닫힘 상태
            - onClose={closeEditProfileModal} → 닫을 때 실행할 함수
            - currentUser={user} → 현재 사용자 정보 전달
            - onSave={handleSaveProfile} → 저장 버튼 누를 때 실행할 함수
          👉 즉, **“내 프로필 수정하는 팝업창”**을 띄우는 부분. */}

      {user && editingProduct && (
        <EditProductModal
          isOpen={isEditProductModalOpen}
          onClose={closeEditProductModal}
          product={editingProduct}
          onSave={handleSaveProduct}
        />
      )}
      {/*  - 로그인한 사용자(user)가 있고, 수정하려는 상품(editingProduct)도 선택된 경우만 실행.
           - EditProductModal → 상품 수정 창(모달).
           - 속성들:
             - isOpen={isEditProductModalOpen} → 열림/닫힘 상태
             - onClose={closeEditProductModal} → 닫기 함수
             - product={editingProduct} → 지금 수정 중인 상품 정보 전달
             - onSave={handleSaveProduct} → 저장 버튼 누르면 실행할 함수
           👉 즉, “선택한 상품을 수정하는 팝업창”을 띄우는 부분. */}
    </div>
  );
};

export default MyPage;