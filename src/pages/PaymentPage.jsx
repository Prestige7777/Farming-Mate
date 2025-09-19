import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { buyNowProduct } = location.state || {}; // 바로 구매 상품

  const { cartItems, loading, cartTotal, clearCart } = useCart();

  // 결제할 상품 목록 (바로 구매 상품이 있으면 그것을 사용, 없으면 장바구니 상품 사용)
  const productsToPay = buyNowProduct ? [buyNowProduct] : cartItems;

  // 총 결제 금액 계산 (바로 구매 상품이 있으면 그것의 금액, 없으면 장바구니 총액)
  const calculatedTotalAmount = buyNowProduct ? (buyNowProduct.price * buyNowProduct.quantity) : cartTotal;

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    zipCode: '',
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [viewTerms, setViewTerms] = useState(null); // null, 'service', or 'privacy'

  useEffect(() => {
    if (!loading && productsToPay.length === 0) {
      alert('결제할 상품이 없습니다. 상품을 담아주세요.');
      navigate('/'); // 상품이 없으면 홈으로 리다이렉트
    }
  }, [productsToPay, loading, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const totalAmount = calculatedTotalAmount;
  const shippingFee = 3000; // 예시 배송비
  const finalPaymentAmount = totalAmount + shippingFee;

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleAgreeToTerms = () => {
    setAgreedToTerms(!agreedToTerms);
  };

  const toggleTerms = (term) => {
    setViewTerms(current => (current === term ? null : term));
  };

  const handlePayment = () => {
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.zipCode) {
      alert('배송 정보를 모두 입력해주세요.');
      return;
    }
    if (!selectedPaymentMethod) {
      alert('결제 수단을 선택해주세요.');
      return;
    }
    if (!agreedToTerms) {
      alert('주문 내용을 확인하고 약관에 동의해주세요.');
      return;
    }

    alert('결제가 완료되었습니다!');

    // 트랜잭션 객체 생성
    const newTransaction = {
      id: `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // 고유 ID 생성
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD 형식
      products: productsToPay.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageUrl,
      })),
      shippingInfo: shippingInfo,
      amount: finalPaymentAmount,
      paymentMethod: selectedPaymentMethod,
      status: '결제 완료', // 초기 상태
    };

    // localStorage에서 기존 트랜잭션 불러오기
    const existingTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    // 새 트랜잭션을 기존 목록에 추가
    const updatedTransactions = [newTransaction, ...existingTransactions];
    // localStorage에 업데이트된 트랜잭션 목록 저장
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

    // 장바구니를 통해 결제한 경우에만 장바구니 비우기
    if (!buyNowProduct) {
      clearCart();
    }

    navigate('/purchasesales'); // 결제 성공 시, 구매 내역 페이지로 이동
  };

  return (
    <div className="payment-page">
      <main className="payment-main">
        <h1 className="page-title">결제하기</h1>

        <div className="payment-section order-summary-section">
          <h2 className="section-title">주문 상품</h2>
          <div className="order-items-list">
            {productsToPay.map((item) => (
              <div key={item.id} className="order-item">
                <img src={item.imageUrl} alt={item.name} className="order-item-image" />
                <div className="order-item-details">
                  <span className="order-item-name">{item.name}</span>
                  <span className="order-item-quantity">{item.quantity}개</span>
                  <span className="order-item-price">{(item.price * item.quantity).toLocaleString()}원</span>
                </div>
              </div>
            ))}
          </div>
          <div className="summary-details">
            <div className="summary-row">
              <span>총 상품 금액</span>
              <span>{totalAmount.toLocaleString()}원</span>
            </div>
            <div className="summary-row">
              <span>배송비</span>
              <span>{shippingFee.toLocaleString()}원</span>
            </div>
            <div className="summary-total-amount">
              <span>총 결제 금액</span>
              <span>{finalPaymentAmount.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        <div className="payment-section shipping-info-section">
          <h2 className="section-title">배송 정보</h2>
          <div className="shipping-form">
            <input
              type="text"
              name="name"
              placeholder="이름"
              value={shippingInfo.name}
              onChange={handleShippingInfoChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="연락처"
              value={shippingInfo.phone}
              onChange={handleShippingInfoChange}
            />
            <input
              type="text"
              name="zipCode"
              placeholder="우편번호"
              value={shippingInfo.zipCode}
              onChange={handleShippingInfoChange}
            />
            <input
              type="text"
              name="address"
              placeholder="주소"
              value={shippingInfo.address}
              onChange={handleShippingInfoChange}
            />
            <input
              type="text"
              name="detailAddress"
              placeholder="상세 주소 (선택 사항)"
              value={shippingInfo.detailAddress}
              onChange={handleShippingInfoChange}
            />
          </div>
        </div>

        <div className="payment-section payment-method-section">
          <h2 className="section-title">결제 수단</h2>
          <div className="payment-methods-grid">
            <Button
              variant="outline"
              className={`payment-method-button ${selectedPaymentMethod === '삼성페이' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect('삼성페이')}
            >
              <img src="/src/assets/images/samsung_pay.png" alt="삼성페이" />
              <span>삼성페이</span>
            </Button>
            <Button
              variant="outline"
              className={`payment-method-button ${selectedPaymentMethod === '애플페이' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect('애플페이')}
            >
              <img src="/src/assets/images/apple_pay.jpg" alt="애플페이" />
              <span>애플페이</span>
            </Button>
            <Button
              variant="outline"
              className={`payment-method-button ${selectedPaymentMethod === '네이버페이' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect('네이버페이')}
            >
              <img src="/src/assets/images/naver_pay.jpg" alt="네이버페이" />
              <span>네이버페이</span>
            </Button>
            <Button
              variant="outline"
              className={`payment-method-button ${selectedPaymentMethod === '카카오페이' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect('카카오페이')}
            >
              <img src="/src/assets/images/kakao_pay.jpg" alt="카카오페이" />
              <span>카카오페이</span>
            </Button>
            {/* 추가 결제 수단 (신용카드, 계좌이체 등) */}
            <Button
              variant="outline"
              className={`payment-method-button ${selectedPaymentMethod === '신용카드' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect('신용카드')}
            >
              <span>신용카드</span>
            </Button>
            <Button
              variant="outline"
              className={`payment-method-button ${selectedPaymentMethod === '계좌이체' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect('계좌이체')}
            >
              <span>계좌이체</span>
            </Button>
          </div>
        </div>

        <div className="payment-section terms-agreement-section">
          <h2 className="section-title">약관 동의</h2>
          <label className="terms-checkbox">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={handleAgreeToTerms}
            />
            <span>
              주문 내용을 확인하였으며,{' '}
              <a href="#!" onClick={(e) => { e.preventDefault(); toggleTerms('service'); }} style={{ color: '#27ae60', fontWeight: 'bold' }}>
                이용약관
              </a>{' '}
              및{' '}
              <a href="#!" onClick={(e) => { e.preventDefault(); toggleTerms('privacy'); }} style={{ color: '#27ae60', fontWeight: 'bold' }}>
                개인정보 수집/이용
              </a>
              에 동의합니다.
            </span>
          </label>

          {viewTerms === 'service' && (
            <div className="terms-content-box">
              <h3>전자상거래(인터넷사이버몰) 표준약관</h3>
              <p><strong>제1조(목적)</strong> 이 약관은 Farming Mate 회사(전자상거래 사업자)가 운영하는 Farming Mate 사이버 몰(이하 “몰”이라 한다)에서 제공하는 인터넷 관련 서비스(이하 “서비스”라 한다)를 이용함에 있어 사이버 몰과 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.</p>
              <p><strong>제12조(청약철회 등)</strong></p>
              <p>① “몰”과 재화등의 구매에 관한 계약을 체결한 이용자는 「전자상거래 등에서의 소비자보호에 관한 법률」 제13조 제2항에 따른 계약내용에 관한 서면을 받은 날(그 서면을 받은 때보다 재화 등의 공급이 늦게 이루어진 경우에는 재화 등을 공급받거나 재화 등의 공급이 시작된 날을 말합니다)부터 7일 이내에는 청약의 철회를 할 수 있습니다. 다만, 청약철회에 관하여 「전자상거래 등에서의 소비자보호에 관한 법률」에 달리 정함이 있는 경우에는 동 법 규정에 따릅니다.</p>
              <p>② 이용자는 재화 등을 배송 받은 경우 다음 각 호의 1에 해당하는 경우에는 반품 및 교환을 할 수 없습니다.</p>
              <ol>
                <li>1. 이용자에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우(다만, 재화 등의 내용을 확인하기 위하여 포장 등을 훼손한 경우에는 청약철회를 할 수 있습니다)</li>
                <li>2. 이용자의 사용 또는 일부 소비에 의하여 재화 등의 가치가 현저히 감소한 경우</li>
                <li>3. 시간의 경과에 의하여 재판매가 곤란할 정도로 재화등의 가치가 현저히 감소한 경우 (예: 신선식품)</li>
                <li>4. 같은 성능을 지닌 재화 등으로 복제가 가능한 경우 그 원본인 재화 등의 포장을 훼손한 경우</li>
              </ol>
              <p><strong>제14조(환급)</strong> “몰”은 이용자가 구매신청한 재화 등이 품절 등의 사유로 인도 또는 제공을 할 수 없을 때에는 지체 없이 그 사유를 이용자에게 통지하고 사전에 재화 등의 대금을 받은 경우에는 대금을 받은 날부터 3영업일 이내에 환급하거나 환급에 필요한 조치를 취합니다.</p>
            </div>
          )}

          {viewTerms === 'privacy' && (
            <div className="terms-content-box">
              <h3>개인정보 수집/이용 동의</h3>
              <p><strong>1. 수집하는 개인정보 항목 및 수집 목적</strong></p>
              <ul>
                <li><strong>- 수집 항목:</strong> 성명, 주소, 연락처, 이메일 주소</li>
                <li><strong>- 수집 목적:</strong> 상품 배송, 결제, 주문 처리 및 고객 상담, 본인 확인</li>
              </ul>
              <p><strong>2. 개인정보의 보유 및 이용기간</strong></p>
              <p>개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 「전자상거래 등에서의 소비자보호에 관한 법률」 등 관련 법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계 법령에서 정한 일정한 기간 동안 회원 정보를 보관합니다.</p>
              <ul>
                <li>- 계약 또는 청약철회 등에 관한 기록 : 5년</li>
                <li>- 대금결제 및 재화 등의 공급에 관한 기록 : 5년</li>
                <li>- 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년</li>
              </ul>
              <p><strong>3. 동의를 거부할 권리 및 동의 거부에 따른 불이익</strong></p>
              <p>이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 동의를 거부할 경우 상품 구매 및 배송 서비스 이용이 제한될 수 있습니다.</p>
            </div>
          )}
        </div>

        <div className="payment-final-action">
          <Button className="pay-button" onClick={handlePayment}>
            {finalPaymentAmount.toLocaleString()}원 결제하기
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
