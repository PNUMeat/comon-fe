import CaretLeftIcon from '@/assets/Landing/caret_left.svg';
import CaretRightIcon from '@/assets/Landing/caret_right.svg';
import exampleImage1 from '@/assets/Landing/example_img1.png';
import exampleImage2 from '@/assets/Landing/example_img2.png';
import exampleImage3 from '@/assets/Landing/example_img3.png';
import Twisted1 from '@/assets/Landing/twisted_1.png';
import Twisted2 from '@/assets/Landing/twisted_2.png';
import Twisted3 from '@/assets/Landing/twisted_3.png';
import { Spacer } from '@/components/commons/Spacer';
import styled from '@emotion/styled';
import { useState } from 'react';

const usageExamples = [
  {
    title: '코테 기록을 더 쉽게! ✨',
    content: [
      '오늘의 문제 풀이에서 바로 문제를 펼쳐보고 작성해보세요!',
      '기본적인 마크다운 단축키와 코드블록으로 깔끔한 입력을 지원합니다 ✨',
    ],
    image: exampleImage1,
    style: { width: '476px', height: '357px' },
  },
  {
    title: '꾸준한 학습습관 만들기🏃',
    content: [
      '날마다 팀원들과 함께 활동을 기록하세요!',
      '캘린더를 통해 문제를 확인하고, 하루에 한 문제를 함께 풀어보아요✨',
    ],
    image: exampleImage2,
    style: { width: '944px', height: '357px' },
  },
  {
    title: '나에게 맞는 팀을 찾아보세요!',
    content: [
      '나의 코드테스트 목표와 레벨에 맞는 팀을 찾아보세요!',
      '원하는 팀에 참여하거나 직접 팀을 꾸려 함께 성장해봐요✨',
    ],
    image: exampleImage3,
    style: { width: '650px', height: '357px' },
  },
];




export const UsageExample = () => {
  const [index, setIndex] = useState(0);

  const onRightClick = () => {
    const nextIndex = index + 1;
    setIndex(nextIndex > 2 ? 0 : nextIndex);
  }
  const onLeftClick = () => {
    const prevIndex = index - 1;
    setIndex(prevIndex < 0 ? 2 : prevIndex);
  }

  const { title, content, image, style } = usageExamples[index];

  return (
    <Container>
      <TitleBox>{title}</TitleBox>
      <MainBox>
        <ContentContainer>
          <Spacer h={40} />
          <ContentText>{content[0]}</ContentText>
          <ContentText>{content[1]}</ContentText>
        </ContentContainer>
        <Spacer h={28} />
        <img src={image} alt="example" style={style} />
      </MainBox>
      <ButtonStyle style={{top: '50%', left: -30, transform : 'translateY(-50%)' }} onClick={onLeftClick}><CaretIcon src={CaretLeftIcon} /></ButtonStyle> 
      <ButtonStyle style={{top: '50%', right: -30, transform : 'translateY(-50%)'}} onClick={onRightClick}><CaretIcon src={CaretRightIcon} /></ButtonStyle>
      <TwistedDecoration1 src={Twisted1} alt="twisted" />
      <TwistedDecoration2 src={Twisted2} alt="twisted" />
      <TwistedDecoration3 src={Twisted3} alt="twisted" />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 64px;
`;

const MainBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 900px;
  height: 518px;
  background-color: ##FFFFFF66;
  box-shadow: 2px 2px 20px 0px #5E609933;
  border-radius: 40px;
  border: 3px solid #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TitleBox = styled.div`
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 376px;
  height: 68px;
  border-radius: 100px;
  box-shadow: 0px 4px 10px 0px #0000000A;
  background: #FCFCFF;
  z-index: 2;
  color: #111111;
  font-size: 28px;
  font-weight: 600;
  justify-content: center;
  align-items: center;
  display: flex;
  background-blur: 4px;
`;

const ButtonStyle = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 100px;
  background-color: #00000029;
  box-sizing: border-box;
`;

const CaretIcon = styled.img`
  width: 24px;
  height: 24px;
  `;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentText = styled.div`
  font-size: 18px;
  color: #111;
  font-weight: 400;
  line-height: 1.4;
  text-align: center;
  `;

  const TwistedDecoration1 = styled.img`
  position: absolute;
  top: 31px;
  left: 96px;
  width: 74px;
  height: 74px;
  `;

const TwistedDecoration2 = styled.img`
  position: absolute;
  top: 31px;
  right: 88px;
  width: 72px;
  height: 72px;
  `;

const TwistedDecoration3 = styled.img`
  position: absolute;
  top: 101px;
  right: 159px;
  width: 35px;
  height: 35px;
  `;




export default UsageExample;