import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.jsx";
import "../../styles/home/Slider.css";
import { DEFAULT_IMAGE_URL } from '../../utils/constants';

// assets import
import logoBanner from "../../assets/banners/logo.png";
import b1 from "../../assets/banners/slide1.jpg";
import b2 from "../../assets/banners/slide2.jpg";
import b3 from "../../assets/banners/slide3.jpg";
import b4 from "../../assets/banners/slide4.jpg";
import b5 from "../../assets/banners/slide5.jpg";
import b6 from "../../assets/banners/slide6.jpg";
import b7 from "../../assets/banners/slide7.jpg";
import b8 from "../../assets/banners/slide78.jpeg";

const IMAGE_FIT = "cover";

export default function MainSlider({ autoPlay = true, interval = 4000 }) {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const slides = useMemo(
    () => [
      { id: 0, title: "당신과 자연을 잇다", subtitle: "직거래로 즐기는 신선한 자연의 맛", image: logoBanner, link: "/", cta: "바로가기" },
      { id: 1, title: "신규 가입 이벤트", subtitle: "첫 구매 3,000원 즉시 할인", image: b1, link: isLoggedIn ? "/mypage" : "/login", cta: "자세히 보기" },
      { id: 2, title: "산지직송 제철과일", subtitle: "이번 주 가장 달콤한 과일", image: b2, link: "/seasonal-fruits", cta: "과일 보러가기" },
      { id: 3, title: "친환경 채소 구독", subtitle: "매주 신선함을 문앞에서", image: b3, link: "/subscriptions/veggies", cta: "구독 시작하기" },
      { id: 4, title: "농가 공동구매", subtitle: "대량 공동구매로 더 저렴하게", image: b4, link: "/group-buy", cta: "참여하기" },
      { id: 5, title: "포장 개선 프로젝트", subtitle: "지구를 위해, 신선도를 위해", image: b5, link: "/stories/packaging", cta: "자세히 보기" },
      { id: 6, title: "리뷰 이벤트", subtitle: "베스트 리뷰어 선정 & 적립금", image: b6, link: "/reviews/event", cta: "이벤트 참여" },
      { id: 7, title: "프리미엄 농가 프로모션", subtitle: "멤버 농가 전용 혜택", image: b7, link: "/premium", cta: "할인 상품 보기" },
      { id: 8, title: "모던 파머 모집", subtitle: "파밍메이트와 귀농 프로젝트", image: b8, link: "#", cta: "자세히 보기", onClick: () => alert('아직 이벤트 기간이 아닙니다') },
    ],
    [isLoggedIn]
  );

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const timerRef = useRef(null);

  const next = () => {
    setIndex(prevIndex => (prevIndex + 1) % slides.length);
  };

  const prev = () => {
    setIndex(prevIndex => (prevIndex - 1 + slides.length) % slides.length);
  };

  const togglePlay = () => setIsPlaying(p => !p);

  useEffect(() => {
    if (!isPlaying || slides.length === 0) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      next();
    }, interval);
    return () => clearInterval(timerRef.current);
  }, [isPlaying, interval, slides.length]);

  return (
    <div className="mainslider-simple">
      <div className="mainslider-simple__viewport">
        <div 
          className="mainslider-simple__track"
          style={{ transform: `translateX(calc(-${index * 75}% - ${index * 10}px + 12.5%))` }}
        >
          {slides.map((s) => (
            <div key={s.id} className="mainslider-simple__slide">
              {s.onClick ? (
                <a href={s.link} onClick={(e) => { e.preventDefault(); s.onClick(); }}>
                  <img className="mainslider-simple__img" src={s.image || DEFAULT_IMAGE_URL} alt={s.title} style={{ objectFit: IMAGE_FIT }} />
                  <div className="mainslider-simple__meta">
                    <h3 className="mainslider-simple__title">{s.title}</h3>
                    <p className="mainslider-simple__subtitle">{s.subtitle}</p>
                  </div>
                </a>
              ) : (
                <Link to={s.link}>
                  <img className="mainslider-simple__img" src={s.image || DEFAULT_IMAGE_URL} alt={s.title} style={{ objectFit: IMAGE_FIT }} />
                  <div className="mainslider-simple__meta">
                    <h3 className="mainslider-simple__title">{s.title}</h3>
                    <p className="mainslider-simple__subtitle">{s.subtitle}</p>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mainslider-simple__controls">
        <div 
          className="mainslider-simple__progress-bar"
          style={{
            backgroundSize: `${slides.length > 0 ? ((index + 1) / slides.length) * 100 : 0}% 100%`,
          }}
        ></div>
        <div className="mainslider-simple__nav">
          <button className="mainslider-simple__nav-btn" onClick={prev}>‹</button>
          <button className="mainslider-simple__nav-btn" onClick={togglePlay}>{isPlaying ? '❚❚' : '►'}</button>
          <button className="mainslider-simple__nav-btn" onClick={next}>›</button>
        </div>
      </div>
    </div>
  );
}